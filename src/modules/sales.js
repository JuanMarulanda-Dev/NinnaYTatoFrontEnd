import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    permissions: {},
    loading: false,
    dialog: false,
    dateSales: new Date().toISOString().substr(0, 10),
    sales: [],
    sale: {
      customer_id: "",
      print: false,
      send: false,
      cash_register_id: "",
      payment: 0,
      cart: [],
    },
  },
  mutations: {
    SET_SALES(state, sales) {
      state.sales = sales;
    },
    SET_QUANTITY_CART_ITEM(state, { item, quantity }) {
      let index = state.sale.cart.indexOf(item);
      state.sale.cart[index].quantity = quantity;
    },
    SET_TOTAL_CART_ITEM(state, { item, total }) {
      let index = state.sale.cart.indexOf(item);
      state.sale.cart[index].total = total;
    },
    DELETE_CART_ITEM(state, item) {
      let index = state.sale.cart.indexOf(item);
      state.sale.cart.splice(index, 1);
    },
    SET_DIALOG_SALES_HITORY(state, dialog) {
      state.dialog = dialog;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions;
    },
  },
  actions: {
    getAllSales({ state, commit, rootState }) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(
          `/api/sales?branch_office_id=${rootState.mainBranchOffice}&date=${state.dateSales}`
        )
        .then((result) => {
          // save all
          commit("SET_SALES", result.data.sales);
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
    storeSale({ state, commit }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      // Process data before to send HTTP request
      return axios
        .post("/api/sales", state.sale)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Venta registrada exitosamente"
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

    changeStatusSale({ commit, dispatch }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/sales/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            // Reload branch officess
            dispatch("getAllSales");
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
