import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    plans_details: [],
    dialogPlansDetails: false,
    editedItem: {
      id: 0,
      quantity: 0,
      validity: 0,
      discount: 0,
      plan_id: "",
      state: false,
    },
    defaultItem: {
      id: 0,
      quantity: 0,
      validity: 0,
      discount: 0,
      plan_id: "",
      state: false,
    },
  },
  mutations: {
    SET_PLAN_DETAILS(state, details) {
      state.plans_details = details;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
    SET_DIALOG_PLANS_DETAILS(state, dialogPlansDetails) {
      state.dialogPlansDetails = dialogPlansDetails;
    },
  },
  actions: {
    getAllPlansDetails({ commit }) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get("/api/plan-details")
        .then((result) => {
          // save all
          commit("SET_PLAN_DETAILS", result.data.planDetails);
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

    storePlanDetail({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .post("/api/plan-details", state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Plan creado exitosamente"
            );
            // Reload cash registers
            dispatch("getAllPlansDetails");
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

    updatePlanDetail({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .put(`/api/plan-details/${state.editedItem.id}`, state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Plan actualizado exitosamente"
            );
            // Reload cash registers
            dispatch("getAllPlansDetails");
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

    changeStatusPlanDetail({ commit, dispatch }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/plan-details/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            // Reload cash registers
            dispatch("getAllPlansDetails");
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
