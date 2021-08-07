import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
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
  },
  actions: {
    getAllSales({ commit }) {
      axios
        .get("/api/sales")
        .then((result) => {
          commit("SET_SALES", result.data.sales);
        })
        .catch(() => {});
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
  },
};
