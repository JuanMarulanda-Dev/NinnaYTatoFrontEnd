import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    discounts: [
      {
        quantity: 4,
        discount: 50,
      },
      {
        quantity: 4,
        discount: 50,
      },
    ],
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
    SET_PRODUCTS(state, products) {
      state.products = products;
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
    PUSH_NEW_DESCOUNT(state, objectDiscount) {
      state.discounts.push(objectDiscount);
    },
    DELETE_DESCOUNT(state, index) {
      state.discounts.splice(index, 1);
    },
  },
  actions: {
    async getAllProducts({ commit }) {
      try {
        // Activar el loading del datatable
        commit("SET_LOADING_DATATABLE", true);
        let result = await axios.get("/api/products");
        commit("SET_PRODUCTS", result.data.products);
      } catch (error) {
        console.log(error);
      } finally {
        commit("SET_LOADING_DATATABLE", false);
      }
    },

    async storeProduct({ state, commit, dispatch }) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.post("/api/products", state.editedItem);
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Producto creado exitosamente");
          // Reload products
          dispatch("getAllProducts");
        }
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },

    async updateProduct({ state, commit, dispatch }) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.put(
          `/api/products/${state.editedItem.id}`,
          state.editedItem
        );
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Producto actualizado exitosamente");
          // Reload products
          dispatch("getAllProducts");
        }
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },

    async changeStatusProduct({ commit, dispatch }, id) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.delete(`/api/products/${id}`);
        if (result.status == 204) {
          // show message
          this._vm.$toast.success("Estado cambiado exitosamente");
          // Reload products
          dispatch("getAllProducts");
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
