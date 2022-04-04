<template>
  <v-data-table
    fixed-header
    :headers="headers"
    :items="plans_customers_report"
    sort-by="name"
    class="elevation-3"
    :search="search"
    item-key="created_at"
  >
    <!-- Header content datatable -->
    <template v-slot:top>
      <v-toolbar flat color="white" class="rounded-xl">
        <!-- Title Module -->
        <v-toolbar-title>
          <v-icon large>mdi-notebook-multiple</v-icon> Planes de clientes
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-dialog
          ref="start"
          v-model="dialogStart"
          :return-value.sync="startDate"
          persistent
          width="290px"
          :retain-focus="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="mt-8"
              v-model="startDate"
              label="Fecha"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker @change="initialize()" v-model="startDate" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="dialogStart = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.start.save(startDate)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>

        <v-dialog
          ref="end"
          v-model="dialogEnd"
          :return-value.sync="endDate"
          persistent
          width="290px"
          :retain-focus="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="mt-8"
              v-model="endDate"
              label="Fecha"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker @change="initialize()" v-model="endDate" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="dialogEnd = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.end.save(endDate)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          class="mr-2"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar>
    </template>

    <!-- total -->
    <template v-slot:[`item.total`]="{ item }">
      {{ currencyFormat(item.total) }}
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Cliente",
          align: "start",
          value: "customer",
        },
        { text: "Plan", value: "plan", align: "center" },
        { text: "Tikets / Servicios", value: "tickets", align: "center" },
        { text: "Inicio", value: "initial_date", align: "center" },
        { text: "Fin", value: "final_date", align: "center" },
      ],
      dialogStart: false,
      dialogEnd: false,
    };
  },
  mixins: [moneyFormatMixin],
  computed: {
    ...mapState("statistics", ["plans_customers_report", "start", "end"]),
    startDate: {
      get: function () {
        return this.start;
      },
      set: function (newValue) {
        this.SET_START_DATE(newValue);
      },
    },
    endDate: {
      get: function () {
        return this.end;
      },
      set: function (newValue) {
        this.SET_END_DATE(newValue);
      },
    },
  },
  methods: {
    ...mapMutations("statistics", ["SET_START_DATE", "SET_END_DATE"]),
    ...mapActions("statistics", ["getPlanCustomerReportByDates"]),
    initialize() {
      this.getPlanCustomerReportByDates();
    },
  },
};
</script>
