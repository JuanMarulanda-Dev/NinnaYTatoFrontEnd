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
      <div id="wrapper">
        <div id="chart-line2">
          <apexchart
            type="line"
            height="230"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </div>
        <div id="chart-line">
          <apexchart
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

var data = generateDayWiseTimeSeries(new Date("22 Apr 2017").getTime(), 115, {
  min: 30,
  max: 90,
});
function generateDayWiseTimeSeries(baseval, count, yrange) {
  var i = 0;
  var series = [];
  while (i < count) {
    var x = baseval;
    var y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push([x, y]);
    baseval += 86400000;
    i++;
  }
  console.log(series);
  return series;
}

export default {
  data() {
    return {
      menu: false,
      date: moment().startOf("month").format("YYYY-MM-DD"),
      max: moment().startOf("month").format("YYYY-MM-DD"),
      activePicker: null,

      series: [
        {
          data: data,
        },
      ],
      chartOptions: {
        chart: {
          id: "chart2",
          type: "area",
          height: 230,
          toolbar: {
            autoSelected: "pan",
            show: false,
          },
        },
        colors: ["#546E7A"],
        stroke: {
          width: 3,
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

      seriesLine: [
        {
          data: data,
        },
      ],
      chartOptionsLine: {
        chart: {
          id: "chart1",
          height: 130,
          type: "area",
          brush: {
            target: "chart2",
            enabled: true,
          },
          selection: {
            enabled: true,
            xaxis: {
              min: new Date("27 Jul 2017").getTime(),
              max: new Date("14 Aug 2017").getTime(),
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
          tickAmount: 2,
        },
      },
    };
  },

  computed: {
    ...mapState("statistics", ["series_hours", "categories_hours"]),

    chartOptions1() {
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
          curve: "straight",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: this.categories_hours,
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
