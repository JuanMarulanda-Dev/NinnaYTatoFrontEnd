<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">Historial semanal de noches</h3>
      </div>
      <v-spacer></v-spacer>
      <div>
        <v-menu
          ref="menu"
          :close-on-content-click="false"
          v-model="menu"
          transition="scale-transition"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              slot="activator"
              v-model="year"
              label="Año"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            show-current
            ref="picker"
            v-model="date"
            @click:year="save"
            reactive
            no-title
            :max="max"
            :active-picker.sync="activePicker"
          ></v-date-picker>
        </v-menu>
      </div>
    </v-card-title>
    <v-card-text>
      <div id="wrapper">
        <div id="chart-line2">
          <apexchart
            ref="hours"
            type="line"
            height="230"
            :options="chartOptions"
            :series="series_nights"
          ></apexchart>
        </div>
        <div id="chart-line">
          <apexchart
            ref="hours"
            type="area"
            height="130"
            :options="chartOptionsLine"
            :series="seriesLine"
          ></apexchart>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from "moment";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      menu: false,
      date: moment().startOf("month").format("YYYY-MM-DD"),
      max: moment().startOf("month").format("YYYY-MM-DD"),
      activePicker: null,

      chartOptions: {
        chart: {
          id: "chart3",
          type: "area",
          height: 230,
          toolbar: {
            autoSelected: "pan",
            show: false,
          },
        },
        colors: ["#546E7A"],
        stroke: {
          width: 2,
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          opacity: 1,
        },
        markers: {
          size: 0,
        },
        xaxis: {
          type: "datetime",
        },
        zoom: {
          enabled: false,
        },
      },
    };
  },

  computed: {
    ...mapState("statistics", ["series_nights"]),

    seriesLine() {
      return this.series_nights;
    },

    chartOptionsLine() {
      return {
        chart: {
          id: "chart4",
          height: 130,
          type: "area",
          brush: {
            target: "chart3",
            enabled: true,
          },
          selection: {
            enabled: true,
            xaxis: {
              min: new Date(this.minDate).getTime(),
              max: new Date(this.maxDate).getTime(),
            },
          },
        },
        colors: ["#008FFB"],
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.91,
            opacityTo: 0.1,
          },
        },
        xaxis: {
          type: "datetime",
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          tickAmount: 0,
        },
      };
    },

    minDate() {
      return this.getDateOfWeekByYear(this.year, 1);
    },
    maxDate() {
      return this.getDateOfWeekByYear(
        this.year,
        moment(this.date).weeksInYear()
      );
    },

    year() {
      let year = null;
      if (this.date) {
        year = moment(this.date).format("YYYY");
      }
      return year;
    },
  },

  watch: {
    menu(val) {
      val && this.$nextTick(() => (this.activePicker = "YEAR"));
    },
    series_nights: {
      handler() {
        this.series_nights;
        this.$refs.hours.updateSeries(this.series_nights);
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations("statistics", ["SET_YEAR"]),
    ...mapActions("statistics", ["getLodgingNightsReport"]),
    save(date) {
      this.$refs.menu.save(date);
      this.activePicker = "YEAR";
      this.menu = false;
      this.SET_YEAR(this.year);
      this.getLodgingNightsReport();
    },

    getDateOfWeekByYear(year, week) {
      // Create moment object for the first day of the given year
      let func = moment({ year: year });
      // Check if 1st of January is in the first week of the year
      func.startOf("week").add(week, "week");
      // Return result using english locale
      return func.locale("en").format("D MMM YYYY");
    },
  },
};
</script>
