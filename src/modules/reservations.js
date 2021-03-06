import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    room_loading: false,
    dialog_form: false,
    dialog_schedule_gantt: false,
    all: false,
    start: "",
    end: "",
    reservations: [],
    rooms: [],
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
    SET_START_DATE(state, start) {
      state.start = start;
    },
    SET_END_DATE(state, end) {
      state.end = end;
    },
    SET_DIALOG_FORM(state, dialog_form) {
      state.dialog_form = dialog_form;
    },
    SET_DIALOG_SCHEDULE_GANTT(state, dialog_schedule_gantt) {
      state.dialog_schedule_gantt = dialog_schedule_gantt;
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
    getAllReservations({ state, commit, rootState }) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(
          `/api/reservations?branch_office_id=${rootState.mainBranchOffice}&start=${state.start}&end=${state.end}`
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

    storeReservation({ state, commit, dispatch }, refresh_datatable = 0) {
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

            if (refresh_datatable) {
              // Reload reservations
              dispatch("getAllReservations");
            }

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
