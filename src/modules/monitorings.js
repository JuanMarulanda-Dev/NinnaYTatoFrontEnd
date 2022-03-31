import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    dialogEntry: false,
    monitorings: [],
    monitoring_types: [],
    monitoring_options: [],
  },
  mutations: {
    SET_MONITORINGS(state, monitorings) {
      state.monitorings = monitorings;
    },
    SET_MONITORING_TYPE(state, monitoring_types) {
      state.monitoring_types = monitoring_types;
    },
    SET_MONITORING_OPTIONS(state, monitoring_options) {
      state.monitoring_options = monitoring_options;
    },
  },
  actions: {
    getAllMonitoringTypes({ state, commit }) {
      if (state.monitoring_types.length === 0) {
        axios
          .get(`/api/monitoring-types`)
          .then((result) => {
            commit("SET_MONITORING_TYPE", result.data.monitoringTypes);
          })
          .catch(() => {});
      }
    },

    getAllMonitoringOptions({ state, commit }) {
      if (state.monitoring_options.length === 0) {
        axios
          .get(`/api/monitorings/options`)
          .then((result) => {
            commit("SET_MONITORING_OPTIONS", result.data.options);
          })
          .catch(() => {});
      }
    },

    getMonitoryByPetLodging({ commit }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .get(`/api/lodgings/${id}/monitorings`)
        .then((result) => {
          if (result.status === 200) {
            // save all
            commit("SET_MONITORINGS", result.data.monitorings);
            // Result
            return true;
          }
          return false;
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

    storeMonitoring({ commit, dispatch }, { id, data }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });

      let formData = new FormData();
      for (var key in data) {
        if (data[key] == null) {
          formData.append(key, "");
        } else if (typeof data[key] === "boolean") {
          formData.append(key, data[key] ? "1" : "0");
        } else {
          console.log(data[key]);
          formData.append(key, data[key]);
        }
      }

      console.log(formData);

      return axios
        .post(`/api/lodgings/${id}/monitorings`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-type, X-Auth-Token, Authorization, Origin",
          },
        })
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Seguimiento registrado exitosamente."
            );
            // Reload cash registers
            dispatch("getMonitoryByPetLodging", id);

            return true;
          }
        })
        .catch((errors) => {
          console.log(errors);
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

    deleteMonitoringPet({ commit }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/monitorings/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Seguimiento eliminado exitosamente"
            );
            // Reload cash registers
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
