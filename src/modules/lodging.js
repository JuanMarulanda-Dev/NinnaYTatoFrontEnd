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
    lodgings_history: [],
    accessories: [],
    default_accessories: [],
    pets: [],
    default_liquidation_plan: null,
    entryData: {
      pet_id: "",
      accessories: [],
      alerts: [],
      prize: false,
      walk: false,
      breakfast: false,
      lunch: false,
      dinner: false,
      date: "",
      time: "",
      day_instructions: "",
    },
    outputData: {
      date: "",
      time: "",
      plan: null,
      payment: 0,
      cash_register_id: "",
      overtime_liquidity_option: false,
    },
    alertsData: {
      hora: "",
      type: "",
      description: "",
      frecuency: [],
    },
    outputDefaultData: {
      date: "",
      time: "",
      plan: null,
      payment: 0,
      cash_register_id: "",
      overtime_liquidity_option: false,
    },
    entryDataDefault: {
      pet_id: "",
      accessories: [],
      alerts: [],
      prize: false,
      walk: false,
      breakfast: false,
      lunch: false,
      dinner: false,
      date: "",
      time: "",
      day_instructions: "",
    },
    default_plans_details: [],
    sales_lodging: [],
  },
  mutations: {
    SET_LODGINGS(state, lodgings) {
      state.lodgings = lodgings;
    },
    SET_SALE_DETAILS_LODGING(state, sales_lodging) {
      state.sales_lodging = sales_lodging.map((obj) => ({
        ...obj,
        payment: "",
      }));
    },
    SET_LODGINGS_HISTORY(state, lodgings_history) {
      state.lodgings_history = lodgings_history;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
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
    SET_DEFAULT_PLANS_DETAILS(state, default_plans_details) {
      state.default_plans_details = default_plans_details.map((obj) => ({
        ...obj,
        type: 2, //PlanDetail
      }));
    },
    SET_DEFAULT_DATA_ENTRY(state) {
      state.entryData = JSON.parse(JSON.stringify(state.entryDataDefault));
    },
    SET_ENTRY_DATA(state, entryData) {
      state.entryData = JSON.parse(JSON.stringify(entryData));
    },
    SET_DEFAULT_DATA_OUTPUT(state) {
      state.outputData = Object.assign({}, state.outputDefaultData);
    },
    SET_OUTPUT_DATA(state, outputData) {
      state.outputData = JSON.parse(JSON.stringify(outputData));
    },
    SET_DEFAULT_PLAN_DETAIL_TO_LIQUIDATION(state, default_liquidation_plan) {
      state.default_liquidation_plan = default_liquidation_plan;
    },
    PUSH_NEW_ALERT(state, alert) {
      state.entryData.alerts.push(alert);
    },
    DELETE_ALERT(state, index) {
      state.entryData.alerts.splice(index, 1);
    },
  },
  actions: {
    getPlaDetailDefaultToLiquidationHoursExtra({ commit }) {
      axios
        .get(`/api/lodgings/departures/default-liquidity-hours-extra`)
        .then((result) => {
          // save all
          commit(
            "SET_DEFAULT_PLAN_DETAIL_TO_LIQUIDATION",
            result.data.defaultLiquidityHoursExtra
          );
        })
        .catch(() => {});
    },

    getAllLodging({ commit, rootState }, { status = 0, date = "" }) {
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

    getAllAccessories({ state, commit }) {
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

    getAllCustomerPlans({ commit }) {
      axios
        .get("/api/lodgings/accessories")
        .then((result) => {
          commit("SET_DEFAULT_ACCESORIES", result.data.accessories);
          commit("SET_ACCESORIES");
        })
        .catch(() => {});
    },

    getAllSaleDetailsByLodging({ commit }, id) {
      axios
        .get(`/api/lodgings/${id}/sales`)
        .then((result) => {
          commit("SET_SALE_DETAILS_LODGING", result.data.lodgingSales);
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

    getAllDefaultPlans({ commit }) {
      axios
        .get(`/api/default-plan-details?unitPlanDetail=true`)
        .then((result) => {
          commit("SET_DEFAULT_PLANS_DETAILS", result.data.defaultPlans);
        })
        .catch(() => {});
    },

    storeLodging({ commit, dispatch, rootState }, data) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      data.branch_office_id = rootState.mainBranchOffice;
      data.alerts = data.alerts.map((item) => {
        item.frequency = JSON.stringify(item.frequency);
        return item;
      });
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

    updateLodging({ commit, dispatch, rootState }, { data, id }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      data.branch_office_id = rootState.mainBranchOffice;
      data.alerts = data.alerts.map((item) => {
        item.frequency = JSON.stringify(item.frequency);
        return item;
      });
      return axios
        .put(`/api/lodgings/${id}`, data)
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

    storeLodgingDeparture(
      { commit, dispatch },
      { data, id, is_close, date_search = "" }
    ) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .post(`/api/lodgings/${id}/departures`, data)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Salida registrada exitosamente."
            );
            let status = is_close ? 0 : 1;
            // Reload cash registers
            dispatch("getAllLodging", { status, date: date_search });

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
