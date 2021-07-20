import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    suppliers: [],
  },
  mutations: {
    SET_SUPPLIERS(state, suppliers) {
      state.suppliers = suppliers;
    },
  },
  actions: {
    getAllSuppliers({ commit }) {
      axios
        .get("/api/suppliers")
        .then((result) => {
          commit("SET_SUPPLIERS", result.data.suppliers);
        })
        .catch(() => {});
    },
  },
};
