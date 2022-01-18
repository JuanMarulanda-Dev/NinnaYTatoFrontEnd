<template>
  <div>
    <v-data-table
      fixed-header
      :headers="headers"
      :items="movements"
      sort-by="name"
      class="elevation-3"
      :loading="loading"
      :loading-text="loadingText"
    >
      <!-- Header content datatable -->
      <template v-slot:top>
        <v-toolbar flat color="white" class="rounded-xl">
          <!-- Title Module -->
          <v-toolbar-title>
            <v-icon large>mdi-notebook-multiple</v-icon> Movimientos
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- Modal New/edit-->
          <v-dialog v-model="dialog" persistent max-width="600px">
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
                  <v-icon large>mdi-notebook-multiple</v-icon>
                  Nuevo movimiento (Egreso)
                </span>
              </v-card-title>

              <v-card-text>
                <!-- Form movements -->
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="editedItem.mediator"
                        label="Mediador*"
                        required
                        counter="255"
                        :error-messages="mediatorErrors"
                        @input="$v.editedItem.mediator.$touch()"
                        @blur="$v.editedItem.mediator.$touch()"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="6">
                      <v-select
                        v-model="editedItem.group"
                        :items="groups"
                        class="text-center"
                        item-text="name"
                        item-value="id"
                        label="Grupo*"
                        :error-messages="groupErrors"
                        @input="$v.editedItem.group.$touch()"
                        @blur="$v.editedItem.group.$touch()"
                      ></v-select>
                    </v-col>

                    <v-col cols="6">
                      <v-select
                        v-model="editedItem.cash_register_id"
                        :items="cash_registers"
                        class="text-center"
                        item-text="name"
                        item-value="id"
                        label="Origen*"
                        :error-messages="cashRegisterErrors"
                        @input="$v.editedItem.cash_register_id.$touch()"
                        @blur="$v.editedItem.cash_register_id.$touch()"
                      ></v-select>
                    </v-col>

                    <v-col cols="6">
                      <vuetify-money
                        v-model="editedItem.price"
                        label="Valor*"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        label="Nota"
                        v-model="note"
                        :error-messages="notaErrors"
                        @input="$v.note.$touch()"
                        @blur="$v.note.$touch()"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save()"
                  >Guardar</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <!-- price -->
      <template v-slot:[`item.total`]="{ item }">
        <!-- Definir colores rojo para egresos - verde para ingresos -->
        <v-icon small>{{ moneyIcon }}</v-icon>
        {{ currencyFormat(item.total) }}
      </template>

      <!-- Actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <!-- Eliminar (Only egresos) -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              dark
              color="secondary mr-1"
              v-bind="attrs"
              v-on="on"
              @click="deleteItem(item)"
              v-show="permissions.delete"
            >
              <v-icon> {{ deleteIcon }} </v-icon>
            </v-btn>
          </template>
          <span>Eliminar</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { required, maxLength, minValue } from "vuelidate/lib/validators";
import { mapState, mapActions, mapMutations } from "vuex";
import VuetifyMoney from "@/components/vuetifyMoney.vue";

export default {
  data: () => ({
    permissions: {},
    dialog: false,
    id_movement: 0,
    payment_proof: 0,
    note: 0,
    dialogNoteForm: false,
    headers: [
      {
        text: "Fecha",
        align: "start",
        value: "created_at",
      },
      { text: "Mediador", value: "price" },
      { text: "Tipo", value: "type_movement" },
      { text: "Grupo", value: "group" },
      { text: "Origin / Destino", value: "cash_register" },
      { text: "Total", value: "total" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
  }),
  mixins: [validationMixin, moneyFormatMixin],
  validations: {
    editedItem: {
      mediator: { required, maxLength: maxLength(255) },
      group: { required },
      cash_register_id: { required },
      total: { required, minValue: minValue(1) },
    },
  },
  computed: {
    ...mapState(["deleteIcon", "loadingText", "mainBranchOffice"]),
    ...mapState("movements", [
      "movements",
      "loading",
      "editedItem",
      "defaultItem",
    ]),
    mediatorErrors() {
      const errors = [];
      if (!this.$v.editedItem.mediator.$dirty) return errors;
      !this.$v.editedItem.mediator.required &&
        errors.push("El mediador es requerido");
      !this.$v.editedItem.mediator.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    groupErrors() {
      const errors = [];
      if (!this.$v.editedItem.group.$dirty) return errors;
      !this.$v.editedItem.group.required &&
        errors.push("El grupo es requerido");
      return errors;
    },
    cashRegisterErrors() {
      const errors = [];
      if (!this.$v.editedItem.cash_register_id.$dirty) return errors;
      !this.$v.editedItem.cash_register_id.required &&
        errors.push("El origen es requerido");
      return errors;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
      this.$v.$reset();
    },
    mainBranchOffice() {
      if (this.permissions.read) {
        this.initialize();
      }
    },
  },

  created() {
    // Obtener los permisos
    this.permissions = this.$route.meta.permissions;

    // Acciones que debe realizar el componente una vez creado
    if (this.permissions.read) {
      this.initialize();
    }
  },

  methods: {
    ...mapActions("products", [
      "getAllProducts",
      "storeProduct",
      "updateProduct",
      "changeStatusProduct",
    ]),
    ...mapMutations("movements", ["SET_EDIT_ITEM"]),
    initialize() {
      this.getAllProducts();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.SET_EDIT_ITEM(Object.assign({}, this.defaultItem));
        this.editedIndex = -1;
      });
    },

    save() {
      // activate validations form
      this.$v.$touch();
      // Correct validations
      if (!this.$v.$invalid) {
        // Do store
        this.storeProduct().then((result) => {
          if (result) {
            this.close();
          }
        });
      }
    },

    updateRowNote(note) {
      let row = this.movements.find(
        (element) => element.id === this.id_movement
      );
      row.note = note;
    },
  },

  components: {
    VuetifyMoney,
  },
};
</script>
