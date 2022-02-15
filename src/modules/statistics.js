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
    plans_customers_report: [],
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
    getLodgingCountReportByDates({ commit, rootState, state }) {
      axios
        .get(
          `/api/lodging-count-report?branch_office_id=${rootState.mainBranchOffice}&start=${state.start}&end=${state.end}`
        )
        .then((result) => {
          commit("PLANS_CUSTOMERS_REPORT", result.data.customerPlanReport);
        })
        .catch(() => {});
    },
  },
};
