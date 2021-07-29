import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    loading: false,
    records: [],
  },
  mutations: {
    SET_RECORDS(state, records) {
      state.records = records;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
  },
  actions: {
    getRecordsByDate({ commit }, date) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(`/api/records?date=${date}`)
        .then((result) => {
          // save all
          commit("SET_RECORDS", result.data.records);
        })
        .catch((errors) => {
          // show error message
          this._vm.showToastMessage(
            errors.response.status,
            this._vm.createMessageError(errors.response.data.errors)
          );
          return false;
        })
        .finally(() => {
          commit("SET_LOADING_DATATABLE", false);
        });
    },
  },
};
