import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    egress_types: [],
    editedItem: {
      id: 0,
      mediator: "",
      egress_type_id: "",
      cash_register_id: "",
      total: "",
    },
    defaultItem: {
      id: 0,
      mediator: "",
      egress_type_id: "",
      cash_register_id: "",
      total: "",
    },
  },
  mutations: {
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
    SET_EGRESS_TYPES(state, egress_types) {
      state.egress_types = egress_types;
    },
  },
  actions: {
    getAllEgressTypes({ commit }) {
      axios
        .get(`/api/egress-types`)
        .then((result) => {
          // save all
          commit("SET_EGRESS_TYPES", result.data.egressTypes);
        })
        .catch(() => {});
    },

    storeEgress({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .post("/api/egresses", state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Egreso creado exitosamente"
            );
            //  Update movemnts
            dispatch("movements/getAllMovementsBewteenDates", null, {
              root: true,
            });
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

    updateEgress({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .put(`/api/egresses/${state.editedItem.id}`, state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Egreso actualizado exitosamente"
            );
            //  Update movemnts
            dispatch("movements/getAllMovementsBewteenDates", null, {
              root: true,
            });
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
        .delete(`/api/egresses/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            //  Update movemnts
            dispatch("movements/getAllMovementsBewteenDates", null, {
              root: true,
            });
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
