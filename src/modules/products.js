import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    products: [],
    editedItem: {
      id: 0,
      name: "",
      price: "",
      stock: "",
      state: false,
    },
    defaultItem: {
      id: 0,
      name: "",
      price: "",
      stock: "",
      state: true,
    },
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
  },
  actions: {
    getAllProducts({ commit, rootState }, status = 0) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(`/api/products/${rootState.mainBranchOffice}/${status}`)
        .then((result) => {
          // save all
          commit("SET_PRODUCTS", result.data.products);
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

    storeProduct({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .post("/api/products", state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Producto creado exitosamente"
            );
            // Reload cash registers
            dispatch("getAllProducts");
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

    updateProduct({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .put(`/api/products/${state.editedItem.id}`, state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Producto actualizado exitosamente"
            );
            // Reload cash registers
            dispatch("getAllProducts");
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

    changeStatusProduct({ commit, dispatch }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/products/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            // Reload cash registers
            dispatch("getAllProducts");
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
