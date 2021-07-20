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
    getAllDiscountByPlanDetail({ commit }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .get(`/api/discounts/${id}`)
        .then((result) => {
          if (result.status == 200) {
            commit("SET_DISCOUNTS", result.data.discounts);
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

    storeDiscountToPlanDetail({ state, commit }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .post(`/api/discounts/${state.id_plan_details}`, {
          discounts: state.discounts,
        })
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Descuentos guardados exitosamente"
            );
            commit("SET_ID_PLAN_DETAILS", 0);
            // Result
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
