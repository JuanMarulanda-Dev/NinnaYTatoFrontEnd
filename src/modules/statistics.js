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
      { name: "Miercoles", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Jueves", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Viernes", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: "Sabado", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
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
      series.forEach((serie) => {
        let index = state.series.findIndex(
          (element) => element.name === serie.name
        );
        state.series[index].data = serie.data;
      });
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
  },
};
