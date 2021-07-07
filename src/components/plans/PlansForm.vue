<template>
  <v-dialog
    v-model="dialogPlans"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
  >
    <!-- Modal Form -->
    <v-card tile color="background">
      <v-toolbar flat dark color="secondary" max-height="10vh">
        <v-toolbar-title
          ><span class="headline">
            <v-icon large>mdi-alpha-p-circle-outline</v-icon>
            Planes
          </span></v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn icon dark @click="SET_DIALOG_PLANS(false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <!-- Datatable planes-->
          <v-data-table
            fixed-header
            :headers="headers"
            :items="plans"
            sort-by="name"
            class="elevation-3"
            :loading="loading"
            :loading-text="loadingText"
          >
            <!-- Header content datatable -->
            <template v-slot:top>
              <v-toolbar flat color="white" class="rounded-xl">
                <!-- Title Module -->
                <v-toolbar-title> </v-toolbar-title>
                <v-spacer></v-spacer>
                <!-- Modal New/edit-->
                <v-dialog v-model="dialog" persistent max-width="500px">
                  <!-- Button active modal -->
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      fab
                      small
                      color="secondary"
                      elevation="3"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      v-show="permissions.create"
                    >
                      <v-icon>mdi-plus-thick</v-icon>
                    </v-btn>
                  </template>
                  <!-- Modal Form -->
                  <v-card>
                    <v-card-title>
                      <span class="headline">
                        <v-icon large>mdi-alpha-p-circle-outline</v-icon>
                        {{ formTitle }}
                      </span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Nombre*"
                              required
                              prepend-inner-icon="mdi-format-letter-matches"
                              counter="255"
                              :error-messages="nameErrors"
                              @input="$v.editedItem.name.$touch()"
                              @blur="$v.editedItem.name.$touch()"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="editedItem.equivalence"
                              label="Equivalencia en horas"
                              type="number"
                              min="0"
                              required
                              prepend-inner-icon="mdi-format-letter-matches"
                              counter="255"
                              :error-messages="equivalenceErrors"
                              @input="$v.editedItem.equivalence.$touch()"
                              @blur="$v.editedItem.equivalence.$touch()"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <vuetify-money
                              v-model="editedItem.price"
                              label="Valor*"
                              :options="currencyOptions"
                            />
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-select
                              v-model="editedItem.plan_type_id"
                              item-text="name"
                              item-value="id"
                              label="Tipo de plan"
                              append-icon="mdi-format-list-bulleted-type"
                              :error-messages="planTypeErrors"
                              @input="$v.editedItem.plan_type_id.$touch()"
                              @blur="$v.editedItem.plan_type_id.$touch()"
                            ></v-select>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="error darken-1" text @click="close()">
                        Cancel
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="save()">
                        Guardar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>

            <!-- State -->
            <template v-slot:[`item.state`]="{ item }">
              <v-switch
                :input-value="item.state"
                v-model="item.state"
                @change="changeStateProduct(item)"
                v-show="permissions.delete"
              ></v-switch>
            </template>

            <!-- Actions -->
            <template v-slot:[`item.actions`]="{ item }">
              <!-- Editar -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab
                    x-small
                    dark
                    color="secondary mr-1"
                    v-bind="attrs"
                    v-on="on"
                    @click="editItem(item)"
                    v-show="permissions.update"
                  >
                    <v-icon> {{ editIcon }} </v-icon>
                  </v-btn>
                </template>
                <span>Editar</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, numeric } from "vuelidate/lib/validators";
import { mapState, mapMutations, mapActions } from "vuex";
import VuetifyMoney from "@/components/vuetifyMoney.vue";

export default {
  name: "plans-form",
  data() {
    return {
      editedIndex: -1,
      dialog: false,
      headers: [
        {
          text: "Nombre",
          align: "start",
          value: "name",
        },
        { text: "Equivalencia", value: "equivalence" },
        { text: "Valor unidad", value: "price" },
        { text: "Tipo", value: "type" },
        { text: "Creado", value: "created_at" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
    };
  },
  mixins: [validationMixin],
  validations: {
    editedItem: {
      name: { required, maxLength: maxLength(255) },
      equivalence: { required, maxLength: maxLength(255), numeric },
      plan_type_id: { required },
    },
  },
  computed: {
    ...mapState(["currencyOptions", "loadingText"]),
    ...mapState("plans", [
      "dialogPlans",
      "plans",
      "loading",
      "editedItem",
      "defaultItem",
      "permissions",
      "types",
    ]),
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Plan" : "Editar Plan";
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
        errors.push("El nombre es requerido");
      !this.$v.editedItem.name.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    planTypeErrors() {
      const errors = [];
      if (!this.$v.editedItem.plan_type_id.$dirty) return errors;
      !this.$v.editedItem.plan_type_id.required &&
        errors.push("El tipo es requerido");
      return errors;
    },
    equivalenceErrors() {
      const errors = [];
      if (!this.$v.editedItem.equivalence.$dirty) return errors;
      !this.$v.editedItem.equivalence.required &&
        errors.push("LA equivalencia es requerido");
      !this.$v.editedItem.equivalence.numeric &&
        errors.push("La equivalencia debe ser un numero");
      !this.$v.editedItem.equivalence.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
      this.$v.$reset();
    },
  },
  created() {
    // Consultar Tipos de planes
    this.getAllPlansType();

    if (this.permissions.read) {
      this.initialize();
    }
  },
  methods: {
    ...mapActions("plans", [
      "getAllPlans",
      "storePlan",
      "updatePlan",
      "getAllPlansType",
    ]),
    ...mapMutations("plans", ["SET_DIALOG_PLANS", "SET_EDIT_ITEM"]),
    initialize() {
      this.getAllPlans();
    },

    editItem(item) {
      this.editedIndex = this.plans.indexOf(item);
      this.SET_EDIT_ITEM(Object.assign({}, item));
      // this.editedItem = ;
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.SET_EDIT_ITEM(Object.assign({}, this.defaultItem));
        this.editedIndex = -1;
      });
    },

    save() {
      this.$v.$touch();
      // Correct validations
      if (!this.$v.$invalid) {
        if (this.editedIndex > -1) {
          // Do update
          this.updateProduct();
        } else {
          // Do store
          this.storeProduct();
        }
        // Close modal
        this.close();
      }
    },
  },
  components: {
    VuetifyMoney,
  },
};
</script>
