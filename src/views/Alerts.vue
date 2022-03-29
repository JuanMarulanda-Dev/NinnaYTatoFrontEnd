<template>
  <v-data-table
    fixed-header
    :headers="headers"
    :items="alerts"
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
          <v-icon large>mdi-file-edit-outline</v-icon> Alertas
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <!-- Modal New/edit-->
        <v-dialog v-model="dialog" persistent max-width="800px">
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
                <v-icon large>mdi-file-edit-outline</v-icon>
                {{ formTitle }}
              </span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      label="Mascota*"
                      v-model="editedItem.pet_id"
                      :items="pets"
                      item-value="id"
                      item-text="name"
                      chips
                      dense
                      :error-messages="petErrors"
                      @input="$v.editedItem.pet_id.$touch()"
                      @blur="$v.editedItem.pet_id.$touch()"
                    >
                      <template v-slot:selection="{ item }">
                        <v-chip>
                          <span>
                            {{ item.name }}
                            <v-badge
                              dot
                              class="mx-1"
                              :color="item.state ? 'success' : 'error'"
                            ></v-badge>
                          </span>
                        </v-chip>
                      </template>

                      <template v-slot:item="{ item }">
                        <span>
                          {{ item.name }}
                          <v-badge
                            class="ml-1"
                            :color="item.state ? 'success' : 'error'"
                          ></v-badge>
                        </span>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select
                      label="Hora"
                      :items="times"
                      v-model="editedItem.time"
                      :error-messages="timeErrors"
                      @input="$v.editedItem.time.$touch()"
                      @blur="$v.editedItem.time.$touch()"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select
                      label="Tipo de alarma"
                      v-model="editedItem.alert_type_id"
                      :items="alert_types"
                      item-text="name"
                      item-value="id"
                      :error-messages="alertTypeErrors"
                      @input="$v.editedItem.alert_type_id.$touch()"
                      @blur="$v.editedItem.alert_type_id.$touch()"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" class="pt-0">
                    <v-textarea
                      v-model="editedItem.description"
                      outlined
                      height="100"
                      label="Instrucciones de la alerta"
                      counter="255"
                      :error-messages="descriptionErrors"
                      @input="$v.editedItem.description.$touch()"
                      @blur="$v.editedItem.description.$touch()"
                    ></v-textarea>
                    <v-radio-group class="my-0" v-model="row" row>
                      <v-radio label="Diario" value="1"></v-radio>
                      <v-radio label="Solo una vez" value="2"></v-radio>
                      <v-radio label="Personalizado" value="3"></v-radio>
                    </v-radio-group>
                    <transition name="slide-fade">
                      <v-select
                        label="Dias"
                        :items="days"
                        v-model="editedItem.frequency"
                        multiple
                        item-text="day"
                        v-show="row === '3'"
                        :error-messages="frequencyErrors"
                        @input="$v.editedItem.frequency.$touch()"
                        @blur="$v.editedItem.frequency.$touch()"
                      ></v-select>
                    </transition>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save()">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <!-- Avatar + nombre -->
    <template v-slot:[`item.pet`]="{ item }">
      <!-- Image profile -->
      <v-tooltip right v-if="item.pet_avatar">
        <template v-slot:activator="{ on, attrs }">
          <v-avatar v-bind="attrs" v-on="on" class="my-2 mr-1">
            <img :src="item.pet_avatar" :alt="item.pet" />
          </v-avatar>
        </template>
        <span>
          <v-avatar size="200">
            <img :src="item.pet_avatar" :alt="item.pet" />
          </v-avatar>
        </span>
      </v-tooltip>

      <!-- Icon profile -->
      <v-avatar v-else color="grey lighten-1" class="my-2 mr-1">
        <v-icon dark> mdi-dog-side </v-icon>
      </v-avatar>
      <span>
        {{ item.pet }}
      </span>
    </template>

    <!-- State -->
    <template v-slot:[`item.state`]="{ item }">
      <v-switch
        :input-value="item.state"
        v-model="item.state"
        @change="changeStateAlert(item)"
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
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import { mapState, mapActions, mapMutations } from "vuex";

function customAlert() {
  let result = true;
  if (this.row === "3") {
    result = this.editedItem.frequency.length > 0;
  }
  return result;
}

export default {
  data: () => ({
    row: "2",
    permissions: {},
    dialog: false,
    headers: [
      {
        text: "Mascota",
        align: "start",
        value: "pet",
      },
      {
        text: "Descripción",
        align: "start",
        value: "description",
      },
      {
        text: "Frecuencia",
        align: "start",
        value: "days",
      },
      { text: "Tipo", align: "center", value: "alert_type" },
      { text: "Hora", align: "center", value: "time" },
      { text: "Estado", align: "center", value: "state" },
      { text: "Creado", value: "created_at" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
  }),
  mixins: [validationMixin],
  validations: {
    editedItem: {
      pet_id: { required },
      alert_type_id: { required },
      time: { required },
      description: { required, maxLength: maxLength(255) },
      frequency: { customAlert },
    },
  },
  created() {
    this.getAllCustomersPets();
    this.getAllTypes();

    if (this.times.length == 0) {
      this.DO_TIMES();
    }

    // Obtener los permisos
    this.permissions = this.$route.meta.permissions;

    // Acciones que debe realizar el componente una vez creado
    if (this.permissions.read) {
      this.initialize();
    }
  },
  computed: {
    ...mapState(["editIcon", "loadingText", "mainBranchOffice"]),
    ...mapState("lodging", ["pets"]),
    ...mapState("alerts", [
      "times",
      "alerts",
      "loading",
      "editedItem",
      "alert_types",
      "days",
    ]),
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Alerta" : "Editar Producto";
    },
    petErrors() {
      const errors = [];
      if (!this.$v.editedItem.pet_id.$dirty) return errors;
      !this.$v.editedItem.pet_id.required &&
        errors.push("La mascota es requerida");
      // !this.$v.editedItem.pet_id.petAvaliable &&
      //   errors.push("La mascota seleccionada no esta activa.");
      return errors;
    },
    alertTypeErrors() {
      const errors = [];
      if (!this.$v.editedItem.alert_type_id.$dirty) return errors;
      !this.$v.editedItem.alert_type_id.required &&
        errors.push("El tipo es requerido");
      return errors;
    },
    timeErrors() {
      const errors = [];
      if (!this.$v.editedItem.time.$dirty) return errors;
      !this.$v.editedItem.time.required && errors.push("La hora es requerida");
      return errors;
    },
    frequencyErrors() {
      const errors = [];
      if (!this.$v.editedItem.frequency.$dirty) return errors;
      !this.$v.editedItem.frequency.customAlert &&
        errors.push("Los días son requeridos");
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.editedItem.description.$dirty) return errors;
      !this.$v.editedItem.description.required &&
        errors.push("La hora es requerida");
      !this.$v.editedItem.description.maxLength &&
        errors.push("La descripcion es muy larga");
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
        this.getAllCustomersPets();
      }
    },
    row(newValue) {
      switch (newValue) {
        case "1": // daily
          this.editedItem.frequency = [1, 2, 3, 4, 5, 6, 7];
          break;
        case "2": // once
          this.editedItem.frequency = [];
          break;
      }
    },
  },

  methods: {
    ...mapActions("products", [
      "storeProduct",
      "updateProduct",
      "changeStatusProduct",
    ]),
    ...mapActions("alerts", [
      "getAllTypes",
      "getAllAlerts",
      "storeAlert",
      "updateAlert",
      "changeStatusAlert",
    ]),
    ...mapActions("lodging", ["getAllCustomersPets"]),
    ...mapMutations("alerts", ["DO_TIMES", "SET_EDIT_ITEM"]),
    initialize() {
      this.getAllAlerts();
    },

    changeStateAlert(item) {
      // Confirmation to change de status
      this.$confirm("¿Quieres cambiar el estado de esta alerta?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Make to change status to backend
          this.changeStatusAlert(item.id).then((result) => {
            if (!result) {
              // Rollback the state from branch office
              this.rollbackStateAlert(item);
            }
          });
        } else {
          // Rollback the state from branch office
          this.rollbackStateAlert(item);
        }
      });
    },

    rollbackStateAlert(item) {
      let alertIndex = this.alerts.indexOf(item);
      this.alerts[alertIndex].state = !this.alerts[alertIndex].state;
    },

    editItem(item) {
      this.editedIndex = this.alerts.indexOf(item);
      this.SET_EDIT_ITEM(Object.assign({}, item));
      switch (JSON.stringify(item.frequency)) {
        case "[]": // Once
          this.row = "2";
          break;
        case "[1,2,3,4,5,6,7]": // Daily
          this.row = "1";
          break;
        default:
          // Custom
          this.row = "3";
          break;
      }
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.SET_EDIT_ITEM(Object.assign({}, this.defaultItem));
        this.editedIndex = -1;
        this.row = "2";
      });
    },

    save() {
      // activate validations form
      this.$v.$touch();
      // Correct validations
      if (!this.$v.$invalid) {
        if (this.editedIndex > -1) {
          // Do update
          this.updateAlert().then((result) => {
            if (result) {
              this.close();
            }
          });
        } else {
          // Do store
          this.storeAlert().then((result) => {
            if (result) {
              this.close();
            }
          });
        }
      }
    },
  },
};
</script>
