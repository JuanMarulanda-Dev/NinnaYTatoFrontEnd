import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    id_plan_details: 0,
    loading: false,
    discounts: [],
    dialogDiscount: false,
    editedItem: {
      quantity: null,
      discount: null,
    },
    defaultItem: {
      quantity: null,
      discount: null,
    },
  },
  mutations: {
    SET_ID_PLAN_DETAILS(state, id_plan_details) {
      state.id_plan_details = id_plan_details;
    },
    SET_DISCOUNTS(state, discounts) {
      state.discounts = discounts;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
    SET_DIALOG_DISCOUNT(state, dialogDiscount) {
      state.dialogDiscount = dialogDiscount;
    },
    PUSH_NEW_DISCOUNT(state, objectDiscount) {
      state.discounts.push(objectDiscount);
    },
    DELETE_DISCOUNT(state, index) {
      state.discounts.splice(index, 1);
    },
  },
  actions: {
    async getAllDiscountByPlanDetail({ commit }, id) {
      try {
        // Activar el loading del datatable
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.get(`/api/discounts/${id}`);
        if (result.status == 200) {
          commit("SET_DISCOUNTS", result.data.discounts);
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

    async storeDiscountToPlanDetail({ state, commit }) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.post(
          `/api/discounts/${state.id_plan_details}`,
          { discounts: state.discounts }
        );
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Descuentos guardados exitosamente");
          commit("SET_ID_PLAN_DETAILS", 0);
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
