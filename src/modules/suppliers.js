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
    async getAllSuppliers({ commit }) {
      try {
        let result = await axios.get("/api/suppliers");
        commit("SET_SUPPLIERS", result.data.suppliers);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
