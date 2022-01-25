import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    movements: [],
    income_plans: [],
    start: "",
    end: "",
  },
  mutations: {
    SET_MOVEMENTS(state, movements) {
      state.movements = movements;
    },
    SET_INCOME_PLANS(state, income_plans) {
      state.income_plans = income_plans;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_START_DATE(state, start) {
      state.start = start;
    },
    SET_END_DATE(state, end) {
      state.end = end;
    },
  },
  actions: {
    getAllMovementsBewteenDates({ state, commit, rootState }) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(
          `/api/movements?branch_office_id=${rootState.mainBranchOffice}&start=${state.start}&end=${state.end}`
        )
        .then((result) => {
          // save all
          commit("SET_MOVEMENTS", result.data.movements);
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

    getAllIncomePlans({ state, commit, rootState }) {
      axios
        .get(
          `/api/movements/income-plans?branch_office_id=${rootState.mainBranchOffice}&start=${state.start}&end=${state.end}`
        )
        .then((result) => {
          // save all
          commit("SET_INCOME_PLANS", result.data.incomePlans);
        });
    },

    storeEgress({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .post("/api/egress", state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Producto creado exitosamente"
            );
            // Reload cash registers
            dispatch("getAllProducts");
            // Result
            return true;
          }
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
          commit("SET_OVERLAY_LOADING", false, { root: true });
        });
    },

    deleteEgress({ commit, dispatch }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/egress/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            // Reload cash registers
            dispatch("getAllMovementsBewteenDates");
            return true;
          } else {
            return false;
          }
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
          commit("SET_OVERLAY_LOADING", false, { root: true });
        });
    },
  },
};
