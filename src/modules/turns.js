import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    start: "",
    end: "",
    turns: [],
    turn_types: [],
    collaborators: [],
    editedItem: {
      id: 0,
      date: "",
      user_id: "",
      turn_type_id: "",
      cash_register_id: "",
      total: "",
      payment: 0,
      note: "",
    },
    defaultItem: {
      id: 0,
      date: "",
      user_id: "",
      turn_type_id: "",
      cash_register_id: "",
      total: "",
      payment: 0,
      note: "",
    },
    headersTurns: [
      {
        text: "Fecha",
        align: "start",
        value: "date",
      },
      { text: "Colaborador", value: "name" },
      { text: "Turno", value: "turn_type" },
      { text: "Valor", value: "total" },
      { text: "Abono", value: "payment" },
      { text: "Nota", value: "note" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    formDialog: false,
    editedIndex: -1,
    dialogNoteForm: false,
  },
  mutations: {
    SET_TURNS(state, turns) {
      state.turns = turns;
    },
    SET_TURN_TYPES(state, turn_types) {
      state.turn_types = turn_types;
    },
    SET_COLLABORATORS(state, collaborators) {
      state.collaborators = collaborators;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_EDIT_ITEM(state, object) {
      state.editedItem = object;
    },
    SET_START_DATE(state, start) {
      state.start = start;
    },
    SET_END_DATE(state, end) {
      state.end = end;
    },
    SET_FORM_DIALOG(state, formDialog) {
      state.formDialog = formDialog;
    },
    SET_EDITED_INDEX(state, editedIndex) {
      state.editedIndex = editedIndex;
    },
  },
  actions: {
    getAllCollaborators({ commit }) {
      axios
        .get(`/api/turns/collaborators`)
        .then((result) => {
          // save all
          commit("SET_COLLABORATORS", result.data.collaborators);
        })
        .catch(() => {});
    },

    getAllTurnTypes({ commit }) {
      axios
        .get(`/api/turn-types`)
        .then((result) => {
          // save all
          commit("SET_TURN_TYPES", result.data.turnTypes);
        })
        .catch(() => {});
    },

    getAllTurns({ state, commit, rootState }) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(
          `/api/turns?branch_office_id=${rootState.mainBranchOffice}&start=${state.start}&end=${state.end}`
        )
        .then((result) => {
          // save all
          commit("SET_TURNS", result.data.turns);
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

    storeTurn({ state, commit, dispatch }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .post("/api/turns", state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Turno creado exitosamente"
            );
            // Reload cash registers
            dispatch("getAllTurns");
            dispatch("getAllCollaborators");
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

    updateTurn({ state, commit, dispatch, rootState }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .put(`/api/turns/${state.editedItem.id}`, state.editedItem)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Turno actualizado exitosamente"
            );
            // Unless from movements module
            if (!rootState.movements.module_status) {
              // Reload cash registers
              dispatch("getAllTurns");
              dispatch("getAllCollaborators");
            } else {
              dispatch(
                "movements/getMovementDetails",
                { id: state.editedItem.id, type: 3 },
                { root: true }
              );
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

    deleteTurn({ commit, dispatch, rootState }, id) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/turns/${id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);

            // Unless from movements module
            if (!rootState.movements.module_status) {
              // Reload cash registers
              dispatch("getAllTurns");
              dispatch("getAllCollaborators");
            } else {
              commit("SET_TURNS", []);
            }
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
