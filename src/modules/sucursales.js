import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    sucursales: [],
  },
  mutations: {
    SET_BRANCH_OFFICES(state, sucursales) {
      state.sucursales = sucursales;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
  },
  actions: {
    async getAllBranchOffices({ commit }) {
      try {
        // Activar el loading del datatable
        commit("SET_LOADING_DATATABLE", true);

        let result = await axios.get("/api/branch-offices");
        commit("SET_BRANCH_OFFICES", result.data.branch_offices);
      } catch (error) {
        console.log(error);
      } finally {
        commit("SET_LOADING_DATATABLE", false);
      }
    },
  },
  getters: {},
};
