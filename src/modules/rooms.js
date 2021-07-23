import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    rooms: [],
    editedItem: {
      id: 0,
      name: "",
      capacity: "",
      color: "",
      state: false,
    },
    defaultItem: {
      id: 0,
      name: "",
      capacity: "",
      color: "",
      state: false,
    },
  },
  mutations: {
    SET_ROOMS(state, rooms) {
      state.rooms = rooms;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
  },
  actions: {
    getAllRooms({ commit, rootState }, status = 0) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(
          `/api/rooms?branch_office_id=${rootState.mainBranchOffice}&state=${status}`
        )
        .then((result) => {
          // save all
          commit("SET_ROOMS", result.data.rooms);
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

    storeRoom({ state, commit, dispatch, rootState }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      state.editedItem.branch_office_id = rootState.mainBranchOffice;
      return axios
        .post("/api/rooms", state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Habitación creada exitosamente"
            );
            // Reload cash registers
            dispatch("getAllRooms");
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

    updateRoom({ state, commit, dispatch, rootState }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      state.editedItem.branch_office_id = rootState.mainBranchOffice;
      return axios
        .put(`/api/rooms/${state.editedItem.id}`, state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Habitación actualizada exitosamente"
            );
            // Reload cash registers
            dispatch("getAllRooms");
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

    changeStatusRoom({ commit, dispatch }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/rooms/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            // Reload cash registers
            dispatch("getAllRooms");
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
