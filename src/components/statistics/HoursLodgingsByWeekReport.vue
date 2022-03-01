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
          :series="series_hours"
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
    ...mapState("statistics", ["series_hours", "categories_hours"]),

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
