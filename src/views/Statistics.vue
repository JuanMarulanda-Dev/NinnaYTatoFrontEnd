<template>
  <div>
    <v-card>
      <v-card-text>
        <v-toolbar flat color="white" class="rounded-xl">
          <v-toolbar-title>
            <v-icon large>mdi-chart-timeline-variant</v-icon> Estadisticas
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
            <v-date-picker
              @change="initialize()"
              v-model="startDate"
              scrollable
            >
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
        </v-toolbar>
      </v-card-text>
    </v-card>
    <v-container fluid>
      <v-row>
        <v-col cols="12" class="px-0 pb-0">
          <lodging-bar-report></lodging-bar-report>
        </v-col>
        <v-col cols="12" class="px-0 pb-0">
          <hours-lodgings-by-week-report></hours-lodgings-by-week-report>
        </v-col>
        <v-col cols="12" class="px-0 pb-0">
          <income-vs-expenses-report></income-vs-expenses-report>
        </v-col>
        <v-col cols="12" class="px-0">
          <!-- Plans Customers Report -->
          <plans-customers-report></plans-customers-report>
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
import IncomeVsExpensesReport from "@/components/statistics/IncomeVsExpensesReport.vue";

export default {
  data: () => ({
    dialogStart: false,
    dialogEnd: false,
  }),

  created() {
    this.SET_START_DATE(moment().startOf("month").format("YYYY-MM-DD"));
    this.SET_END_DATE(moment().endOf("month").format("YYYY-MM-DD"));

    this.initialize();
  },

  computed: {
    ...mapState("statistics", ["start", "end"]),
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
    ...mapMutations(["SET_OVERLAY_LOADING"]),
    ...mapMutations("statistics", ["SET_START_DATE", "SET_END_DATE"]),
    ...mapActions("statistics", [
      "getPlanCustomerReportByDates",
      "getPercentageLodgingsByTime",
      "getIncomesAndEgressByMonths",
    ]),
    initialize() {
      try {
        this.SET_OVERLAY_LOADING(true);
        this.getPlanCustomerReportByDates();
        this.getPercentageLodgingsByTime();
        this.getIncomesAndEgressByMonths();
      } catch (errors) {
        this.showToastMessage(
          errors.response.status,
          this.createMessageError("")
        );
      } finally {
        this.SET_OVERLAY_LOADING(false);
      }
    },
  },
  components: {
    PlansCustomersReport,
    LodgingBarReport,
    HoursLodgingsByWeekReport,
    IncomeVsExpensesReport,
  },
};
</script>
