import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    start: "",
    end: "",
    year: "2022",
    plans_customers_report: [],
    series: [
      { name: "Lunes", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Martes", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Miércoles", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Jueves", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Viernes", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Sábado", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Domingo", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ],
    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Mayo",
      "Abril",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    series_hours: [
      {
        data: [],
      },
    ],
    series_nights: [
      {
        data: [],
      },
    ],
    series_incomes_egress: [
      {
        name: "Ingresos",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: "Egresos",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
    categories_hours: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "47",
      "48",
      "49",
      "50",
      "51",
      "52",
      "53",
    ],
  },
  mutations: {
    SET_START_DATE(state, start) {
      state.start = start;
    },
    SET_END_DATE(state, end) {
      state.end = end;
    },
    PLANS_CUSTOMERS_REPORT(state, plans_customers_report) {
      state.plans_customers_report = plans_customers_report;
    },
    PERCENTAGE_LODGING_REPORT(state, series) {
      state.series.forEach((serie, index) => {
        state.series[index].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      });

      series.forEach((serie) => {
        let index = state.series.findIndex(
          (element) => element.name === serie.name
        );
        state.series[index].data = serie.data;
      });
    },

    SET_INCOMES_EGRESS_REPORT(state, series) {
      state.series_incomes_egress[0].data = series.incomes.data;
      state.series_incomes_egress[1].data = series.egresses.data;
    },

    SET_LODGING_HOURS_REPORT(state, data) {
      state.series_hours[0].data = data;
    },

    SET_LODGING_NIGHTS_REPORT(state, data) {
      state.series_nights[0].data = data;
    },

    SET_YEAR(state, year) {
      state.year = year;
    },
  },
  actions: {
    getPlanCustomerReportByDates({ commit, rootState, state }) {
      axios
        .get(
          `/api/plan-customer-report?branch_office_id=${rootState.mainBranchOffice}&start=${state.start}&end=${state.end}`
        )
        .then((result) => {
          commit("PLANS_CUSTOMERS_REPORT", result.data.customerPlanReport);
        })
        .catch(() => {});
    },
    getPercentageLodgingsByTime({ commit, rootState, state }) {
      axios
        .get(
          `/api/percentage-lodging-report?branch_office_id=${rootState.mainBranchOffice}&year=${state.year}`
        )
        .then((result) => {
          commit("PERCENTAGE_LODGING_REPORT", result.data.series);
        })
        .catch(() => {});
    },
    getIncomesAndEgressByMonths({ commit, rootState, state }) {
      axios
        .get(
          `/api/incomes-egresses-report?branch_office_id=${rootState.mainBranchOffice}&year=${state.year}`
        )
        .then((result) => {
          commit("SET_INCOMES_EGRESS_REPORT", result.data);
        })
        .catch(() => {});
    },
    getLodgingHoursReport({ commit, rootState, state }) {
      axios
        .get(
          `/api/lodging-hours-report?branch_office_id=${rootState.mainBranchOffice}&year=${state.year}`
        )
        .then((result) => {
          commit("SET_LODGING_HOURS_REPORT", result.data.hours);
        })
        .catch(() => {});
    },
    getLodgingNightsReport({ commit, rootState, state }) {
      axios
        .get(
          `/api/lodging-nights-report?branch_office_id=${rootState.mainBranchOffice}&year=${state.year}`
        )
        .then((result) => {
          commit("SET_LODGING_NIGHTS_REPORT", result.data.nights);
        })
        .catch(() => {});
    },
  },
};
