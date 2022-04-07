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
    income_products: [],
    start: "",
    end: "",
    exchange: {
      cash_register_id: "",
      movement_type: "",
      payment_id: "",
    },
    dialogMovementDetail: false,
    movement_type: 0,
    module_status: true,
  },
  mutations: {
    SET_MOVEMENTS(state, movements) {
      state.movements = movements;
    },
    SET_INCOMES(state, incomes) {
      state.income_plans = incomes.incomePlans;
      state.income_products = incomes.incomeProducts;
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
    SET_DIALOG_MOVEMENT(state, dialogMovementDetail) {
      state.dialogMovementDetail = dialogMovementDetail;
    },
    SET_MOVEMENT_TYPE(state, movement_type) {
      state.movement_type = movement_type;
    },
    SET_MODULE_STATUS(state, module_status) {
      state.module_status = module_status;
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

    getMovementDetails({ commit }, { id, type }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      axios
        .get(`/api/movements/${id}?movement_type=${type}`)
        .then((result) => {
          // Guardar el movimiento de acuerto del tipo
          switch (type) {
            case 1: // sales
              commit("sales/SET_SALES", [result.data.movement], { root: true });
              break;

            case 3: //Turns
              commit("turns/SET_TURNS", [result.data.movement], { root: true });
              break;

            case 5: //Pruchases
              commit("purchases/SET_PURCHASES", [result.data.movement], {
                root: true,
              });
              break;
          }

          commit("SET_MOVEMENT_TYPE", type);
          commit("SET_DIALOG_MOVEMENT", true);
        })
        .catch((errors) => {
          // show error message
          this._vm.showToastMessage(
            errors.response.status,
            this._vm.createMessageError(errors.response.data.errors)
          );
        })
        .finally(() => {
          commit("SET_OVERLAY_LOADING", false, { root: true });
        });
    },

    getAllIncomes({ state, commit, rootState }) {
      axios
        .get(
          `/api/movements-incomes?branch_office_id=${rootState.mainBranchOffice}&start=${state.start}&end=${state.end}`
        )
        .then((result) => {
          // save all
          commit("SET_INCOMES", result.data);
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

    saveExchangeCashRegister({ state, commit }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .put(`/api/movements/${id}/exchange`, state.exchange)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Intercambio realizado exitosamente."
            );
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
  },
};
