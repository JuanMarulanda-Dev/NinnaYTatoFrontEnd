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
      // formData.append("image", data.image, data.image.name);
      // formData.append("description", data.description);
      // formData.append("option_id", data.option_id);
      // formData.append("monitoring_type_id", data.monitoring_type_id);
      // formData.append("date", data.date);

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

      // , {
      //   headers: {
      //     "access-control-allow-credentials": true,
      //     "access-control-allow-headers":
      //       "access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,x-xsrf-token",
      //     "access-control-allow-methods": "POST",
      //     "access-control-allow-origin": "https://spa.ninnaytato.com",
      //     "access-control-max-age": 0,
      //     "cache-control": "no-cache, private",
      //   },
      // }

      return axios
        .post(`/api/lodgings/${id}/monitorings`, formData, {
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
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
          // show error message
          this._vm.showToastMessage(
            errors.response.status ?? 500,
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
