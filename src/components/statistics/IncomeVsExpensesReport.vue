<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">Historial semanal de horas</h3>
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
      <div id="chart">
        <apexchart
          type="line"
          height="350"
          :options="chartOptions"
          :series="series_incomes_egress"
        ></apexchart>
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
    };
  },

  computed: {
    ...mapState("statistics", ["months", "series_incomes_egress"]),

    chartOptions() {
      return {
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [5, 7, 5],
          curve: "straight",
          dashArray: [0, 8, 5],
        },
        legend: {
          tooltipHoverFormatter: function (val, opts) {
            let number = Number(
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]
            ).toLocaleString("pt-BR", {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
              style: "currency",
              currency: "COP",
            });
            return val + " - " + number + "";
          },
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6,
          },
        },
        xaxis: {
          categories: this.months,
        },
        yaxis: {
          labels: {
            /**
             * Allows users to apply a custom formatter function to yaxis labels.
             *
             * @param { String } value - The generated value of the y-axis tick
             * @param { index } index of the tick / currently executing iteration in yaxis labels array
             */
            formatter: function (val) {
              return Number(val).toLocaleString("pt-BR", {
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
                style: "currency",
                currency: "COP",
              });
            },
          },
        },
        tooltip: {
          y: [
            // {
            //   title: {
            //     formatter: function (val) {
            //       return val + " (mins)";
            //     },
            //   },
            // },
            // {
            //   title: {
            //     formatter: function (val) {
            //       return val + " per session";
            //     },
            //   },
            // },
            // {
            //   title: {
            //     formatter: function (val) {
            //       return val;
            //     },
            //   },
            // },
          ],
        },
        grid: {
          borderColor: "#f1f1f1",
        },
      };
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
  },
  methods: {
    ...mapMutations("statistics", ["SET_YEAR"]),
    ...mapActions("statistics", ["getPercentageLodgingsByTime"]),
    save(date) {
      this.$refs.menu.save(date);
      this.activePicker = "YEAR";
      // this.$refs.picker.activePicker = "YEAR";
      this.menu = false;
      this.SET_YEAR(this.year);
      this.getPercentageLodgingsByTime();
    },
  },
};
</script>
