import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    dialogEntry: false,
    lodgings: [],
    accessories: [],
    default_accessories: [],
    pets: [],
    monitorings: [],
    monitoring_types: [],
    editedItem: {
      id: 0,
      name: "",
      price: "",
      stock: "",
      state: false,
    },
    defaultItem: {
      id: 0,
      name: "",
      price: "",
      stock: "",
      state: true,
    },
  },
  mutations: {
    SET_LODGINGS(state, lodgings) {
      state.lodgings = lodgings;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
    SET_DEFAULT_ACCESORIES(state, accessories) {
      state.default_accessories = accessories;
    },
    SET_ACCESORIES(state) {
      state.accessories = state.default_accessories.map((obj) => ({
        ...obj,
        description: "",
      }));
    },
    SET_PETS(state, pets) {
      state.pets = pets;
    },
    SET_MONITORINGS(state, monitorings) {
      state.monitorings = monitorings;
    },
    SET_MONITORING_TYPE(state, monitoring_types) {
      state.monitoring_types = monitoring_types;
    },
  },
  actions: {
    getAllLodging({ commit, rootState }) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(`/api/lodgings?branch_office_id=${rootState.mainBranchOffice}`)
        .then((result) => {
          // save all
          commit("SET_LODGINGS", result.data.lodgings);
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

    getAllAccessories({ commit }) {
      axios
        .get("/api/lodgings/accessories")
        .then((result) => {
          commit("SET_DEFAULT_ACCESORIES", result.data.accessories);
          commit("SET_ACCESORIES");
        })
        .catch(() => {});
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

    getAllMonitoringTypes({ commit }) {
      axios
        .get(`/api/monitoring-types`)
        .then((result) => {
          commit("SET_MONITORING_TYPE", result.data.monitoringTypes);
        })
        .catch(() => {});
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
            dispatch("getAllLodging");

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

    storeMonitoring({ commit, dispatch }, { id, form }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });

      let data = {
        monitoring_type_id: form.monitoring_type_id,
        date: `${form.date} ${form.time}`,
        image: form.image,
        description: form.description,
      };

      let formData = new FormData();
      for (var key in data) {
        if (data[key] == null) {
          formData.append(key, "");
        } else if (typeof data[key] === "boolean") {
          formData.append(key, data[key] ? "1" : "0");
        } else {
          formData.append(key, data[key]);
        }
      }

      return axios
        .post(`/api/lodgings/${id}/monitorings`, formData)
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
            errors.response.status,
            this._vm.createMessageError(errors.response.data.errors)
          );
          return false;
        })
        .finally(() => {
          commit("SET_OVERLAY_LOADING", false, { root: true });
        });
    },

    deleteEntry({ commit, dispatch }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/lodgings/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            // Reload cash registers
            dispatch("getAllLodging");
          }
        })
        .catch((errors) => {
          // show error message
          this._vm.showToastMessage(
            errors.response.status,
            this._vm.createMessageError(errors.response.data.errors)
          );
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
