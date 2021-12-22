import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    times: [],
    days: [
      { day: "Lunes", value: 1 },
      { day: "Martes", value: 2 },
      { day: "Miercoles", value: 3 },
      { day: "Jueves", value: 4 },
      { day: "Viernes", value: 5 },
      { day: "Sabado", value: 6 },
      { day: "Domingo", value: 7 },
    ],
    alert_types: [],
    editedItem: {
      pet_id: "",
      time: "",
      alert_type_id: "",
      description: "",
      frequency: [],
    },
    defaultItem: {
      pet_id: "",
      time: "",
      alert_type_id: "",
      description: "",
      frequency: [],
    },
    alerts: [],
  },
  mutations: {
    SET_ALERT_TYPES(state, alert_types) {
      state.alert_types = alert_types;
    },
    SET_ALERTS(state, alerts) {
      state.alerts = alerts;
    },
    SET_DEFAULT_ALERT_DATA(state) {
      state.editedItem = Object.assign({}, state.defaultItem);
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    DO_TIMES(state) {
      let halfHours = ["00", "30"];
      for (let index = 0; index < 24; index++) {
        halfHours.forEach((time) => {
          state.times.push(`${index <= 9 ? 0 : ""}${index}:${time}`);
        });
      }
    },
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
  },
  actions: {
    getAllAlerts({ commit, rootState }) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(`/api/alerts?branch_office_id=${rootState.mainBranchOffice}`)
        .then((result) => {
          // save all
          commit("SET_ALERTS", result.data.alerts);
        })
        .catch((errors) => {
          // show error message
          this._vm.showToastMessage(
            errors.response.status,
            this._vm.createMessageError(errors.response.data.errors)
          );
        })
        .finally(() => {
          commit("SET_LOADING_DATATABLE", false);
        });
    },

    getAllTypes({ state, commit }) {
      if (state.alert_types.length === 0) {
        axios
          .get("/api/alert-types")
          .then((result) => {
            commit("SET_ALERT_TYPES", result.data.alertTypes);
          })
          .catch(() => {});
      }
    },

    storeAlert({ state, commit, dispatch, rootState }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      let data = Object.assign({}, state.editedItem);
      data.frequency = JSON.stringify(data.frequency);
      data.branch_office_id = rootState.mainBranchOffice;
      return axios
        .post("/api/alerts", data)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Alerta registrada exitosamente"
            );
            // Reload cash registers
            dispatch("getAllAlerts");
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

    updateAlert({ state, commit, dispatch, rootState }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      let data = Object.assign({}, state.editedItem);
      data.frequency = JSON.stringify(data.frequency);
      data.branch_office_id = rootState.mainBranchOffice;
      return axios
        .put(`/api/alerts/${state.editedItem.id}`, data)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Alerta actualizada exitosamente"
            );
            // Reload cash registers
            dispatch("getAllAlerts");
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

    changeStatusAlert({ commit, dispatch }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/alerts/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            // Reload cash registers
            dispatch("getAllAlerts");
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
