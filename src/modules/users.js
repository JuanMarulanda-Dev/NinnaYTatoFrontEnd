import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    users: [],
    roles: [],
    branch_offices: [],
    editedItem: {
      id: 0,
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      role_id: "",
      branch_office_id: "",
      password: "",
      password_confirmation: 0,
      state: false,
    },
    defaultItem: {
      id: 0,
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      role_id: "",
      branch_office_id: "",
      password: "",
      password_confirmation: "",
      state: false,
    },
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_ROLES(state, roles) {
      state.roles = roles;
    },
    SET_BRANCH_OFFICES_AVAILABLES(state, branch_offices) {
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
    getAllRoles({ commit }) {
      axios
        .get("/api/roles")
        .then((result) => {
          commit("SET_ROLES", result.data.roles);
        })
        .catch(() => {});
    },
    getBranchOfficesAvailable({ commit }) {
      // If status is 1 will get only availables branch offices and the status is 0 will get all branch offices
      axios
        .get("/api/branch-offices/1")
        .then((result) => {
          commit("SET_BRANCH_OFFICES_AVAILABLES", result.data.branch_offices);
        })
        .catch(() => {});
    },
    getAllUsers({ commit }) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get("/api/users")
        .then((result) => {
          // save all
          commit("SET_USERS", result.data.users);
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

    storeUser({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .post("/api/users", state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Usuario creado exitosamente"
            );
            // Reload users
            dispatch("getAllUsers");
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

    updateUser({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .put(`/api/users/${state.editedItem.id}`, state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Usuario actualizado exitosamente"
            );
            // Reload users
            dispatch("getAllUsers");
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

    changeStatusUser({ commit, dispatch }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/users/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            // Reload branch officess
            dispatch("getAllUsers");
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
