import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    room_loading: false,
    all: false,
    start: "",
    end: "",
    reservations: [],
    rooms: [],
    pets: [],
    editedItem: {
      pet_id: "",
      room_id: "",
      start: "",
      end: "",
    },
    defaultItem: {
      pet_id: "",
      room_id: "",
      start: "",
      end: "",
    },
  },
  mutations: {
    SET_RESERVATIONS(state, reservations) {
      state.reservations = reservations;
    },
    SET_ROOMS(state, rooms) {
      state.rooms = rooms;
    },
    SET_PETS(state, pets) {
      state.pets = pets;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_LOADING_ROOMS_AUTOCOMPLETE(state, status) {
      state.room_loading = status;
    },
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
  },
  actions: {
    getAllReservations({ state, commit }) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(
          `/api/reservations?all=${state.all}&start=${state.start}&end=${state.end}`
        )
        .then((result) => {
          // save all
          commit("SET_RESERVATIONS", result.data.reservations);
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

    getAllRoomsReservationsBetweenDates({ commit, rootState }, { start, end }) {
      commit("SET_LOADING_ROOMS_AUTOCOMPLETE", true);
      axios
        .get(
          `/api/reservations/rooms?branch_office_id=${rootState.mainBranchOffice}&start=${start}&end=${end}`
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
          commit("SET_LOADING_ROOMS_AUTOCOMPLETE", false);
        });
    },

    getAllCustomersPets({ commit, rootState }) {
      axios
        .get(
          `/api/lodgings/pets?branch_office_id=${rootState.mainBranchOffice}`
        )
        .then((result) => {
          commit("SET_PETS", result.data.pets);
        })
        .catch(() => {});
    },

    storeReservation({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .post("/api/reservations", state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Reserva creada exitosamente"
            );
            // Reload reservations
            dispatch("getAllReservations");
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

    updateReservation({ state, commit, dispatch }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .put(`/api/reservations/${id}`, state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Reserva actualizada exitosamente"
            );
            // Reload reservations
            dispatch("getAllReservations");
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

    destroyReservation({ commit, dispatch }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/reservations/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            // Reload cash registers
            dispatch("getAllReservations");
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
