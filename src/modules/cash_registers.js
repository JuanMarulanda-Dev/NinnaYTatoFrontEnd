import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    cash_registers: [],
    editedItem: {
      id: 0,
      name: "",
      state: false,
    },
    defaultItem: {
      id: 0,
      name: "",
      state: false,
    },
  },
  mutations: {
    SET_CASH_REGISTER(state, cash_registers) {
      state.cash_registers = cash_registers;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
  },
  actions: {
    async getAllCashRegisters({ commit, rootState }, status = 0) {
      try {
        // Activar el loading del datatable
        commit("SET_LOADING_DATATABLE", true);
        let result = await axios.get(
          `/api/cash-registers/${rootState.mainBranchOffice}/${status}`
        );
        commit("SET_CASH_REGISTER", result.data.cashRegisters);
      } catch (error) {
        console.log(error);
      } finally {
        commit("SET_LOADING_DATATABLE", false);
      }
    },

    async storeCahsRegister({ state, commit, dispatch, rootState }) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        state.editedItem.branch_office_id = rootState.mainBranchOffice;
        let result = await axios.post("/api/cash-registers", state.editedItem);
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Caja creada exitosamente");
          // Reload cash registers
          dispatch("getAllCashRegisters");
        }
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },

    async updateCahsRegister({ state, commit, dispatch }) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.put(
          `/api/cash-registers/${state.editedItem.id}`,
          state.editedItem
        );
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Caja actualizada exitosamente");
          // Reload cash registers
          dispatch("getAllCashRegisters");
        }
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },

    async changeStatusCahsRegister({ commit, dispatch }, id) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.delete(`/api/cash-registers/${id}`);
        if (result.status == 204) {
          // show message
          this._vm.$toast.success("Estado cambiado exitosamente");
          // Reload cash registers
          dispatch("getAllCashRegisters");
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
};
