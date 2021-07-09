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
    async getAllPlans({ commit }, status = 0) {
      try {
        // Activar el loading del datatable
        commit("SET_LOADING_DATATABLE", true);
        let result = await axios.get(`/api/plans/${status}`);
        commit("SET_PLANS", result.data.plans);
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
      } finally {
        commit("SET_LOADING_DATATABLE", false);
      }
    },

    async getAllPlansType({ commit }) {
      try {
        let result = await axios.get("/api/plan-types");
        commit("SET_TYPES", result.data.planTypes);
      } catch (error) {
        console.log(error);
      }
    },

    async storePlan({ state, commit, dispatch }) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.post("/api/plans", state.editedItem);
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Plan creado exitosamente");
          // Reload plans
          dispatch("getAllPlans");
        }
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },

    async updatePlan({ state, commit, dispatch }) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.put(
          `/api/plans/${state.editedItem.id}`,
          state.editedItem
        );
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Plan actualizado exitosamente");
          // Reload plans
          dispatch("getAllPlans");
        }
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },

    async changeStatusPlan({ commit, dispatch }, id) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.delete(`/api/plans/${id}`);
        if (result.status == 204) {
          // show message
          this._vm.$toast.success("Estado cambiado exitosamente");
          // Reload products
          dispatch("getAllPlans");
          return true;
        } else {
          return false;
        }
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
        return false;
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },
  },
};
