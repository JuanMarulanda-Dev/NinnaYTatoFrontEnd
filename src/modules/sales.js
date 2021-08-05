import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    sales: [],
    sale: {
      customer: "",
      print: false,
      send: false,
      cash_register: "",
      money: 0,
      cart: [],
    },
  },
  mutations: {
    SET_SALES(state, sales) {
      state.sales = sales;
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
  },
};
