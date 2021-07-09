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
    async getAllPlansDetails({ commit }) {
      try {
        // Activar el loading del datatable
        commit("SET_LOADING_DATATABLE", true);
        let result = await axios.get("/api/plan-details");
        commit("SET_PLAN_DETAILS", result.data.planDetails);
      } catch (error) {
        console.log(error);
      } finally {
        commit("SET_LOADING_DATATABLE", false);
      }
    },

    async storePlanDetail({ state, commit, dispatch }) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.post("/api/plan-details", state.editedItem);
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Plan creado exitosamente");
          // Reload plan detail
          dispatch("getAllPlansDetails");
        }
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },

    async updatePlanDetail({ state, commit, dispatch }) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.put(
          `/api/plan-details/${state.editedItem.id}`,
          state.editedItem
        );
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Plan actualizado exitosamente");
          // Reload plan detail
          dispatch("getAllPlansDetails");
        }
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },

    async changeStatusPlanDetail({ commit, dispatch }, id) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.delete(`/api/plan-details/${id}`);
        if (result.status == 204) {
          // show message
          this._vm.$toast.success("Estado cambiado exitosamente");
          // Reload plan detail
          dispatch("getAllPlansDetails");
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
