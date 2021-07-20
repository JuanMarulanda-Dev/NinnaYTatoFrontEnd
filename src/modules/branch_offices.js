import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    branch_offices: [],
    editedItem: {
      id: 0,
      name: "",
      address: "",
      phone: "",
      state: false,
    },
    defaultItem: {
      id: 0,
      name: "",
      address: "",
      phone: "",
      state: true,
    },
  },
  mutations: {
    SET_BRANCH_OFFICES(state, branch_offices) {
      state.branch_offices = branch_offices;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
  },
  actions: {
    getAllBranchOffices({ commit }) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get("/api/branch-offices")
        .then((result) => {
          // save all
          commit("SET_BRANCH_OFFICES", result.data.branch_offices);
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

    storeBranchOffice({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .post("/api/branch-offices", state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Sucursal creada exitosamente"
            );
            // Reload branch officess
            dispatch("getAllBranchOffices");
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

    updateBranchOffice({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .put(`/api/branch-offices/${state.editedItem.id}`, state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Sucursal actualizada exitosamente"
            );
            // Reload branch officess
            dispatch("getAllBranchOffices");
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

    changeStatusBranchOffices({ commit, dispatch }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/branch-offices/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            // Reload cash registers
            dispatch("getAllCashRegisters");
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
