import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    alert_types: [],
    alertsData: {
      time: "",
      type: "",
      description: "",
      frecuency: [],
    },
    alertsDataDefault: {
      time: "",
      type: "",
      description: "",
      frecuency: [],
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
    ADD_NEW_ALERT(state, alert) {
      state.alerts.push(alert);
    },
    DELETE_ALERT(state, alert) {
      let index = state.alerts.indexOf(alert);
      state.alerts.splice(index, 1);
    },
    SET_DEFAULT_ALERT_DATA(state) {
      state.alertsData = Object.assign({}, state.alertsDataDefault);
    },
  },
  actions: {
    getAllAlerts({ commit, rootState }, { status = 0, date = "" }) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(
          `/api/lodgings?branch_office_id=${rootState.mainBranchOffice}&state=${status}&date=${date}`
        )
        .then((result) => {
          // save all
          commit(
            status == 1 ? "SET_LODGINGS" : "SET_LODGINGS_HISTORY",
            result.data.lodgings
          );
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
      if (state.accessories.length === 0) {
        axios
          .get("/api/lodgings/accessories")
          .then((result) => {
            commit("SET_DEFAULT_ACCESORIES", result.data.accessories);
            commit("SET_ACCESORIES");
          })
          .catch(() => {});
      }
    },

    storeLodging({ commit, dispatch, rootState }, data) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      data.branch_office_id = rootState.mainBranchOffice;
      return axios
        .post("/api/lodgings", data)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Ingreso creado exitosamente."
            );
            // Reload cash registers
            dispatch("getAllLodging", { status: 1 });

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
  },
};
