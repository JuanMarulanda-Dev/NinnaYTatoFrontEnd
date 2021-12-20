<template>
  <v-container>
    <v-row>
      <v-col md="4">
        <v-select
          label="Hora"
          :items="times"
          v-model="alertsData.time"
        ></v-select>
      </v-col>
      <v-col md="6">
        <v-select
          label="Tipo de alarma"
          v-model="alertsData.type"
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
          v-model="alertsData.description"
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
            v-model="alertsData.frecuency"
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
    result = this.alertsData.frecuency.lenght > 0;
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
        { text: "Estado", align: "center", value: "time" },
      ],
      days: [
        { day: "Lunes", value: 1 },
        { day: "Martes", value: 2 },
        { day: "Miercoles", value: 3 },
        { day: "Jueves", value: 4 },
        { day: "Viernes", value: 5 },
        { day: "Sabado", value: 6 },
        { day: "Domingo", value: 7 },
      ],
      times: [],
    };
  },
  // model: { prop: "value", event: "input" },
  mixins: [validationMixin],
  validations: {
    alertsData: {
      type: { required },
      time: { required },
      description: { required },
      frecuency: { customAlert },
    },
  },
  created() {
    this.doTimes();
  },
  computed: {
    ...mapState("alerts", ["alerts", "alertsData", "alert_types"]),
  },
  watch: {
    row(newValue) {
      switch (newValue) {
        case "1": // daily
          this.alertsData.frecuency = [1, 2, 3, 4, 5, 6, 7];
          break;
        case "2": // once
        case "3": // Custom
          this.alertsData.frecuency = [];
          break;
      }
    },
  },
  methods: {
    ...mapMutations("alerts", [
      "ADD_NEW_ALERT",
      "SET_DEFAULT_ALERT_DATA",
      "DELETE_ALERT",
    ]),
    doTimes() {
      let halfHours = ["00", "30"];
      for (let index = 0; index < 24; index++) {
        halfHours.forEach((time) => {
          this.times.push(`${index <= 9 ? 0 : ""}${index}:${time}`);
        });
      }
    },
    save() {
      this.$v.touch();
      if (!this.$v.invalid) {
        console.log("hola");
      }
    },
    delete() {},
    edit() {},
  },
};
</script>
