<template>
  <div>
    <v-card>
      <v-card-text>
        <v-toolbar flat color="white" class="rounded-xl">
          <v-toolbar-title>
            <v-icon large>mdi-chart-timeline-variant</v-icon> Estadisticas
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </v-card-text>
    </v-card>
    <v-container fluid>
      <v-row>
        <v-col cols="12" class="px-0">
          <!-- Plans Customers Report (this we have to changes its location)-->
          <plans-customers-report></plans-customers-report>
        </v-col>
        <v-col cols="12" class="px-0 pb-0">
          <lodging-bar-report></lodging-bar-report>
        </v-col>
        <v-col cols="12" class="px-0 pb-0">
          <hours-lodgings-by-week-report></hours-lodgings-by-week-report>
        </v-col>
        <v-col cols="12" class="px-0 pb-0">
          <nights-lodgings-by-week-report></nights-lodgings-by-week-report>
        </v-col>
        <v-col cols="12" class="px-0 pb-0">
          <income-vs-expenses-report></income-vs-expenses-report>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapMutations, mapState } from "vuex";
import PlansCustomersReport from "@/components/statistics/PlansCustomersReport.vue";
import LodgingBarReport from "@/components/statistics/LodgingBarReport.vue";
import HoursLodgingsByWeekReport from "@/components/statistics/HoursLodgingsByWeekReport.vue";
import NightsLodgingsByWeekReport from "@/components/statistics/NightsLodgingsByWeekReport.vue";
import IncomeVsExpensesReport from "@/components/statistics/IncomeVsExpensesReport.vue";

export default {
  data: () => ({}),

  created() {
    this.SET_START_DATE(moment().startOf("month").format("YYYY-MM-DD"));
    this.SET_END_DATE(moment().endOf("month").format("YYYY-MM-DD"));

    this.initialize();
  },

  computed: {
    ...mapState(["mainBranchOffice"]),
  },

  methods: {
    ...mapMutations("statistics", ["SET_START_DATE", "SET_END_DATE"]),
    ...mapActions("statistics", [
      "getPlanCustomerReportByDates",
      "getPercentageLodgingsByTime",
      "getIncomesAndEgressByMonths",
      "getLodgingHoursReport",
      "getLodgingNightsReport",
    ]),
    initialize() {
      try {
        this.getPlanCustomerReportByDates();
        this.getPercentageLodgingsByTime();
        this.getIncomesAndEgressByMonths();
        this.getLodgingHoursReport();
        this.getLodgingNightsReport();
      } catch (errors) {
        this.showToastMessage(
          errors.response.status,
          this.createMessageError("")
        );
      }
    },
  },
  watch: {
    mainBranchOffice() {
      this.initialize();
    },
  },
  components: {
    PlansCustomersReport,
    LodgingBarReport,
    HoursLodgingsByWeekReport,
    NightsLodgingsByWeekReport,
    IncomeVsExpensesReport,
  },
};
</script>
