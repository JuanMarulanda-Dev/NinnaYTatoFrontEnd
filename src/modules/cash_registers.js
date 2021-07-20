import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    cash_registers: [],
    editedItem: {
      id: 0,
      name: "",
      state: false,
    },
    defaultItem: {
      id: 0,
      name: "",
      state: false,
    },
  },
  mutations: {
    SET_CASH_REGISTER(state, cash_registers) {
      state.cash_registers = cash_registers;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
  },
  actions: {
    getAllCashRegisters({ commit, rootState }, status = 0) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(`/api/cash-registers/${rootState.mainBranchOffice}/${status}`)
        .then((result) => {
          // save all
          commit("SET_CASH_REGISTER", result.data.cashRegisters);
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

    storeCahsRegister({ state, commit, dispatch, rootState }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      state.editedItem.branch_office_id = rootState.mainBranchOffice;
      return axios
        .post("/api/cash-registers", state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Caja creada exitosamente"
            );
            // Reload cash registers
            dispatch("getAllCashRegisters");
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

    updateCahsRegister({ state, commit, dispatch }) {
      return axios
        .put(`/api/cash-registers/${state.editedItem.id}`, state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Caja actualizada exitosamente"
            );
            // Reload cash registers
            dispatch("getAllCashRegisters");
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

    changeStatusCahsRegister({ commit, dispatch }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/cash-registers/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            // Reload cash registers
            dispatch("getAllCashRegisters");
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
