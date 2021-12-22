<template>
  <v-container>
    <v-row>
      <v-col md="4">
        <v-select
          label="Hora"
          :items="times"
          v-model="editedItem.time"
        ></v-select>
      </v-col>
      <v-col md="6">
        <v-select
          label="Tipo de alarma"
          v-model="editedItem.alert_type_id"
          :items="alert_types"
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
              @click="save()"
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
          label="Instrucciones de la alerta"
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
          ></v-select>
        </transition>
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-data-table
          height="200"
          :headers="headers"
          :items="alerts"
          fixed-header
          hide-default-footer
          class="elevation-1"
        >
          <!-- State -->
          <!-- <template v-slot:[`item.total`]="{ item }">
            <v-icon>{{ moneyIcon }}</v-icon>
            {{ currencyFormat(item.total) }}
          </template> -->
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
function customAlert() {
  let result = true;
  if (this.row === "3") {
    result = this.editedItem.frecuency.lenght > 0;
  }
  return result;
}

export default {
  name: "output-form",
  data() {
    return {
      row: "2",
      editIndex: -1,
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
        { text: "Tipo", align: "center", value: "type" },
      ],
    };
  },
  mixins: [validationMixin],
  validations: {
    editedItem: {
      alert_type_id: { required },
      time: { required },
      description: { required },
      frequency: { customAlert },
    },
  },
  created() {
    this.getAllTypes();

    if (this.times.length == 0) {
      this.DO_TIMES();
    }
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
  },
  watch: {
    row(newValue) {
      switch (newValue) {
        case "1": // daily
          this.editedItem.frecuency = [1, 2, 3, 4, 5, 6, 7];
          break;
        case "2": // once
        case "3": // Custom
          this.editedItem.frecuency = [];
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
    ]),

    addAlert(alert) {
      this.$v.touch();
      if (!this.$v.invalid) {
        console.log("hola");
        console.log(alert);
      }
      // this.entryData.alerts.push(alert);
      // this.SET_DEFAULT_ALERT_DATA();
    },

    removeAlert(alert) {
      let index = this.entryData.alerts.indexOf(alert);
      this.entryData.alerts.splice(index, 1);
    },

    editAlert(alert) {
      console.log(alert);
    },
  },
};
</script>
