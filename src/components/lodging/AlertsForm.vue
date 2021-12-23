<template>
  <v-container>
    <v-row>
      <v-col md="4">
        <v-select
          label="Hora"
          :items="times"
          v-model="editedItem.time"
          :error-messages="timeErrors"
          @input="$v.editedItem.time.$touch()"
          @blur="$v.editedItem.time.$touch()"
        ></v-select>
      </v-col>
      <v-col md="6">
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
      <v-col md="2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              dark
              color="info mr-1"
              v-bind="attrs"
              v-on="on"
              @click="addAlert(editedItem)"
            >
              <v-icon> mdi-plus-thick</v-icon>
            </v-btn>
          </template>
          <span>Agregar alerta</span>
        </v-tooltip>
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-textarea
          v-model="editedItem.description"
          outlined
          height="100"
          counter="255"
          label="Instrucciones de la alerta"
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
      <v-col cols="12" class="pt-0">
        <v-data-table
          height="200"
          :headers="headers"
          :items="entryData.alerts"
          fixed-header
          hide-default-footer
          class="elevation-1"
        >
          <!-- alert frequency -->
          <template v-slot:[`item.frequency`]="{ item }">
            {{ formatHumanFrequency(item.frequency) }}
          </template>

          <!-- alert type -->
          <template v-slot:[`item.alert_type_id`]="{ item }">
            {{ findAlertType(item.alert_type_id) }}
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
                >
                  <v-icon> {{ editIcon }} </v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>
            <!-- Delete -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  fab
                  x-small
                  dark
                  color="error"
                  v-bind="attrs"
                  v-on="on"
                  @click="deleteItem(item)"
                >
                  <v-icon> {{ deleteIcon }} </v-icon>
                </v-btn>
              </template>
              <span>Eliminar</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
function customAlert() {
  let result = true;
  if (this.row === "3") {
    result = this.editedItem.frequency.length > 0;
  }
  return result;
}

export default {
  name: "output-form",
  data() {
    return {
      row: "2",
      editedIndex: -1,
      headers: [
        {
          text: "Descipción",
          align: "start",
          value: "description",
        },
        {
          text: "Frecuencia",
          align: "start",
          value: "frequency",
        },
        { text: "Hora", align: "center", value: "time" },
        { text: "Tipo", align: "center", value: "alert_type_id" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
    };
  },
  mixins: [validationMixin],
  validations: {
    editedItem: {
      alert_type_id: { required },
      time: { required },
      description: { required, maxLength: maxLength(255) },
      frequency: { customAlert },
    },
  },
  computed: {
    ...mapState("alerts", [
      "alerts",
      "editedItem",
      "alert_types",
      "times",
      "days",
    ]),
    ...mapState("lodging", ["entryData"]),
    ...mapState(["deleteIcon", "editIcon"]),
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
    ...mapMutations("alerts", [
      "ADD_NEW_ALERT",
      "SET_DEFAULT_ALERT_DATA",
      "DELETE_ALERT",
      "DO_TIMES",
      "SET_EDIT_ITEM",
    ]),
    ...mapMutations("lodging", ["PUSH_NEW_ALERT", "DELETE_ALERT"]),

    formatHumanFrequency(frequency) {
      let result = "";
      switch (frequency.length) {
        case 0: // Onece
          result = "Una sola vez";
          break;
        case 7: // daily
          result = "Todos los días";
          break;
        default:
          // custom
          frequency.forEach((indexDay) => {
            result += this.days[indexDay - 1].day + " ";
          });
          break;
      }
      return result;
    },

    findAlertType(id) {
      return this.alert_types.find((item) => item.id === id).name;
    },

    addAlert() {
      this.$v.$touch();
      if (!this.$v.invalid) {
        if (this.editedIndex > -1) {
          // Updated quantity discount
          Object.assign(
            this.entryData.alerts[this.editedIndex],
            this.editedItem
          );
          // Reset index
          this.editedIndex = -1;
        } else {
          // Add new quantity discount
          this.PUSH_NEW_ALERT(this.editedItem);
        }
        this.row = "2";
        this.SET_DEFAULT_ALERT_DATA();
        this.$v.$reset();
      }
    },

    editItem(item) {
      this.editedIndex = this.entryData.alerts.indexOf(item);
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
    },

    deleteItem(item) {
      this.editedIndex = this.entryData.alerts.indexOf(item);
      // Confirmation to change de status
      this.$confirm("¿Seguro quieres eliminar este alerta?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Delete discount
          this.DELETE_ALERT(this.editedIndex);
          this.editedIndex = -1;
        }
      });
    },
  },
};
</script>
