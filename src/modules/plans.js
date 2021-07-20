import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    permissions: {},
    loading: false,
    dialogPlans: false,
    plans: [],
    types: [],
    editedItem: {
      id: 0,
      name: "",
      price: "",
      equivalence: 0,
      type_id: "",
      state: false,
    },
    defaultItem: {
      id: 0,
      name: "",
      price: "",
      equivalence: 0,
      type_id: "",
      state: false,
    },
  },
  mutations: {
    SET_PLANS(state, plans) {
      state.plans = plans;
    },
    SET_TYPES(state, types) {
      state.types = types;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
    SET_DIALOG_PLANS(state, dialogPlans) {
      state.dialogPlans = dialogPlans;
    },
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions;
    },
  },
  actions: {
    getAllPlans({ commit }, status = 0) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(`/api/plans/${status}`)
        .then((result) => {
          // save all
          commit("SET_PLANS", result.data.plans);
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

    getAllPlansType({ commit }) {
      axios
        .get("/api/plan-types")
        .then((result) => {
          commit("SET_TYPES", result.data.planTypes);
        })
        .catch(() => {});
    },

    storePlan({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .post("/api/plans", state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Plan creado exitosamente"
            );
            // Reload plans
            dispatch("getAllPlans");
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

    updatePlan({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .put(`/api/plans/${state.editedItem.id}`, state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Plan actualizado exitosamente"
            );
            // Reload plans
            dispatch("getAllPlans");
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

    changeStatusPlan({ commit, dispatch }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/plans/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            // Reload cash registers
            dispatch("getAllPlans");
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
