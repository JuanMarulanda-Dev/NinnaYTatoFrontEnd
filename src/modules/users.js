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
    branchOffices: [],
    editedItem: {
      id: 0,
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      rol_id: "",
      branch_office_id: "",
      password: "",
      password_confirmation: "",
      state: false,
    },
    defaultItem: {
      id: 0,
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      rol_id: "",
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
    SET_BRANCH_OFFICES_AVAILABLES(state, branchOffices) {
      state.branchOffices = branchOffices;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
  },
  actions: {
    async getAllRoles({ commit }) {
      try {
        let result = await axios.get("/api/roles");
        commit("SET_ROLES", result.data.roles);
      } catch (error) {
        console.log(error);
      }
    },
    async getBranchOfficesAvailable({ commit }) {
      try {
        // If status is 1 will get only availables branch offices and the status is 0 will get all branch offices
        let result = await axios.get("/api/branch-offices/1");
        commit("SET_BRANCH_OFFICES_AVAILABLES", result.data.branch_offices);
      } catch (error) {
        console.log(error);
      }
    },
    async getAllUsers({ commit }) {
      try {
        // Activar el loading del datatable
        commit("SET_LOADING_DATATABLE", true);
        let result = await axios.get("/api/users");
        commit("SET_USERS", result.data.users);
      } catch (error) {
        console.log(error);
      } finally {
        commit("SET_LOADING_DATATABLE", false);
      }
    },

    async storeBranchOffice({ state, commit, dispatch }) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.post("/api/branch-offices", state.editedItem);
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Sucursal creada exitosamente");
          // Reload branch officess
          dispatch("getAllUsers");
        }
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },

    async updateBranchOffice({ state, commit, dispatch }) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.put(
          `/api/branch-offices/${state.editedItem.id}`,
          state.editedItem
        );
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Sucursal actualizada exitosamente");
          // Reload branch officess
          dispatch("getAllUsers");
        }
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },

    async changeStatusBranchOffices({ commit, dispatch }, id) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.delete(`/api/branch-offices/${id}`);
        if (result.status == 200) {
          // show message
          this._vm.$toast.success("Estado cambiado exitosamente");
          // Reload branch officess
          dispatch("getAllUsers");
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
  getters: {},
};
