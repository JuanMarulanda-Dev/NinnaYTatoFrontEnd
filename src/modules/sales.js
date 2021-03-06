import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    permissions: {},
    loading: false,
    dialog: false,
    dialogPayments: false,
    dialogSaleDitails: false,
    saleId: null,
    start: "",
    end: "",
    payments: [],
    saleDetails: {},
    sales: [],
    sale: {
      sale_id: "",
      lodging_id: null,
      customer_id: null,
      print: true,
      send: false,
      cash_register_id: "",
      payment: 0,
      cart: [],
    },
    saleDefault: {
      sale_id: "",
      lodging_id: null,
      customer_id: null,
      print: true,
      send: false,
      cash_register_id: "",
      payment: 0,
      cart: [],
    },
    headersSales: [
      { text: "N°", value: "number_payment_proof", align: "center" },
      { text: "Cliente", value: "customer_name", align: "center" },
      { text: "Total", value: "total" },
      { text: "Pagado", value: "payment" },
      { text: "Saldo pendiente", value: "pending" },
      { text: "Usuario", value: "user_name" },
      { text: "Estado", value: "state" },
      { text: "Fecha", value: "created_at" },
      { text: "Eliminado", value: "deleted_at" },
      { text: "Nota", value: "note", width: "16%" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    payment_proof: 0,
    note: "",
  },
  mutations: {
    SET_SALES(state, sales) {
      state.sales = sales;
    },
    SET_SALE_ID(state, saleId) {
      state.saleId = saleId;
    },
    SET_CUSTOMER_ID(state, customer_id) {
      state.sale.customer_id = customer_id;
    },
    SET_LODGING_ID(state, lodging_id) {
      state.sale.lodging_id = lodging_id;
    },
    SET_PAYMENTS(state, payments) {
      state.payments = payments;
    },
    SET_START_DATE(state, start) {
      state.start = start;
    },
    SET_END_DATE(state, end) {
      state.end = end;
    },
    SET_SALE_DETAILS(state, details) {
      state.saleDetails = details;
    },
    SET_SALE_DEFAULT(state) {
      state.sale = Object.assign({}, state.saleDefault);
      state.sale.cart = [];
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
    SET_DIALOG_SALE_PAYMENTS(state, dialogPayments) {
      state.dialogPayments = dialogPayments;
    },
    SET_DIALOG_SALE_DETAILS(state, dialogSaleDitails) {
      state.dialogSaleDitails = dialogSaleDitails;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions;
    },
    SET_PAYMENT_PROOF(state, payment_proof) {
      state.payment_proof = payment_proof;
    },
    SET_NOTE(state, note) {
      state.note = note;
    },
  },
  actions: {
    getAllSales({ state, commit, rootState }) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(
          `/api/sales?branch_office_id=${rootState.mainBranchOffice}&start=${state.start}&end=${state.end}`
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

    getSaleDetails({ commit }, saleId) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      axios
        .get(`/api/sales/${saleId}`)
        .then((result) => {
          // save all
          if (result.status == 200) {
            commit("SET_SALE_DETAILS", result.data.details);
            commit("SET_DIALOG_SALE_DETAILS", true);
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

    downloadPaymentProof(state, { saleId, name }) {
      // Processing payment prof
      this._vm.showToastMessage(102, "El comprobante se esta descargando...");
      //
      axios
        .get(`/api/sales/${saleId}/payment-proof`, {
          responseType: "blob",
        })
        .then((result) => {
          // save all
          const url = window.URL.createObjectURL(new Blob([result.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${name}.pdf`);
          document.body.appendChild(link);
          link.click();

          return true;
        })
        .catch((errors) => {
          // show error message
          this._vm.showToastMessage(
            errors.response.status,
            this._vm.createMessageError(errors.response.data.errors)
          );
        })
        .finally(() => {});
    },

    storeSale({ state, commit, rootState }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .post("/api/sales", {
          ...state.sale,
          branch_office_id: rootState.mainBranchOffice,
        })
        .then((result) => {
          if (result.status == 200) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Venta registrada exitosamente"
            );

            // Result
            return {
              saleId: result.data.id,
              name: result.data.number_payment_proof,
              print: state.sale.print,
            };
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

    changeStatusSale({ commit }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/sales/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            // if (!rootState.movements.module_status) {
            //   // Reload púrchases
            //   dispatch("getAllSales");
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

    // Esto se deberia encapsular en otro archivo
    getSalePayments({ commit }, saleId) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      // Process data before to send HTTP request
      return axios
        .get(`/api/sales/${saleId}/payments`)
        .then((result) => {
          if (result.status == 200) {
            // show payments dialog
            commit("SET_SALE_ID", saleId);
            commit("SET_PAYMENTS", result.data.payments);
            commit("SET_DIALOG_SALE_PAYMENTS", true);
          }
        })
        .catch((errors) => {
          // show error message
          this._vm.showToastMessage(
            errors.response.status,
            this._vm.createMessageError(errors.response.data.errors)
          );
        })
        .finally(() => {
          commit("SET_OVERLAY_LOADING", false, { root: true });
        });
    },

    storeSalePayment({ state, commit, dispatch, rootState }, data) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .post(`/api/sales/${state.saleId}/payments`, data)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Pago registrado exitosamente."
            );
            // Unless from movements module
            if (!rootState.movements.module_status) {
              // Reload cash registers
              dispatch("getAllSales");
            } else {
              dispatch(
                "movements/getMovementDetails",
                { id: state.saleId, type: 1 },
                { root: true }
              );
            }

            commit("SET_SALE_ID", null);

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

    updatePayment({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .put(`/api/turns/${state.editedItem.id}`, state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Pago actualizado exitosamente"
            );
            // Reload cash registers
            dispatch("getSalePayments");
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

    deletePayment({ state, commit, dispatch }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/payments/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            // Reload cash registers
            dispatch("getSalePayments", state.saleId);
            // Esto lo deberia hacer el front en vez de mandar a consultar todo de nuevo.
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
