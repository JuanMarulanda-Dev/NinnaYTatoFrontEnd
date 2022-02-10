import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    purchases: [],
    editedItem: {
      id: 0,
      product_id: "",
      price: "",
      datetime: "",
      quantity: 1,
      cash_register_id: "",
      supplier_id: "",
      state: false,
      note: "",
    },
    defaultItem: {
      id: 0,
      product_id: "",
      price: "",
      datetime: "",
      quantity: 1,
      cash_register_id: "",
      supplier_id: "",
      state: false,
      note: "",
    },
    headersPurchases: [
      {
        text: "Producto",
        align: "start",
        value: "product_name",
      },
      { text: "Cantidad", value: "quantity", align: "center" },
      { text: "Valor unidad", value: "price" },
      { text: "Fecha", value: "datetime" },
      { text: "Proveedor", value: "supplier_name" },
      { text: "Caja", value: "cash_register_name" },
      { text: "Estado", value: "state" },
      { text: "Creado", value: "created_at" },
      { text: "Eliminado", value: "deleted_at" },
      { text: "Nota", value: "note" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
  },
  mutations: {
    SET_PURCHASES(state, purchases) {
      state.purchases = purchases;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
  },
  actions: {
    getAllPurchases({ commit, rootState }) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(`/api/purchases?branch_office_id=${rootState.mainBranchOffice}`)
        .then((result) => {
          // save all
          commit("SET_PURCHASES", result.data.purchases);
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

    storePurchases({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .post("/api/purchases", state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "La compra fue registrada exitosamente"
            );
            // Reload purchases
            dispatch("getAllPurchases");
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

    changeStatusPurchases({ commit }, purchase) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/purchases/${purchase.id}`, {
          data: {
            cash_register_id: purchase.cash_register_id,
            product_id: purchase.product_id,
          },
        })
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);

            // if (!rootState.movements.module_status) {
            //   // Reload púrchases
            //   dispatch("getAllPurchases");
            // }

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
  getters: {},
};
