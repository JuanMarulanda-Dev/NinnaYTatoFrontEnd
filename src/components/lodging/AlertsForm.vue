<template>
  <v-container>
    <v-row>
      <v-col md="4">
        <v-select label="Hora"></v-select>
      </v-col>
      <v-col md="6">
        <v-select label="Tipo de alarma"></v-select>
      </v-col>
      <v-col md="2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn fab x-small dark color="info mr-1" v-bind="attrs" v-on="on">
              <v-icon> mdi-plus-thick</v-icon>
            </v-btn>
          </template>
          <span>Agregar alerta</span>
        </v-tooltip>
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-textarea
          outlined
          height="100"
          label="Instrucciones de la alerta"
        ></v-textarea>
        <v-radio-group v-model="row" row>
          <v-radio label="Diario" value="radio-1"></v-radio>
          <v-radio label="Solo una vez" value="radio-2"></v-radio>
          <v-radio label="Personalizado" value="radio-3"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <v-data-table
          height="200"
          :headers="headers"
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
// import { mapState, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
// import VuetifyMoney from "@/components/vuetifyMoney.vue";
// import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
// import LiquidationLodging from "@/components/lodging/LiquidationLodging.vue";

export default {
  name: "output-form",
  data() {
    return {
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
    };
  },
  model: { prop: "value", event: "input" },
  // props: {
  //   value: {
  //     type: Boolean,
  //     required: true,
  //   },
  // },
  mixins: [validationMixin],
  validations: {
    outputData: {
      date: { required },
      time: { required },
      cash_register_id: { required },
    },
  },
  computed: {
    colorAccessories() {
      return this.accessories.length > 0 ? "error" : "";
    },
    colorSalesLodging() {
      return this.sales_lodging.length > 0 ? "error" : "";
    },
  },
};
</script>
