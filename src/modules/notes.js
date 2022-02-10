import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
export default {
  namespaced: true,
  state: {
    dialogNoteForm: false,
    noteItem: {
      type: "",
      id: "",
      note: "",
      title: "",
    },
    defaultNoteItem: {
      type: "",
      id: "",
      note: "",
      title: "",
    },
  },
  mutations: {
    SET_EDIT_ITEM_NOTE(state, object) {
      state.noteItem = object;
    },
    SET_DIALOG_NOTE_FORM(state, dialogNoteForm) {
      state.dialogNoteForm = dialogNoteForm;
    },
  },
  actions: {
    storeNote({ commit }, { item_id = 0, item_type = 0, description = "" }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });

      return axios
        .post(`/api/notes`, { item_id, item_type, description })
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Nota guardada exitosamente"
            );
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

    updateNoteFromData({ rootState }, data) {
      let items = [];
      switch (data.type) {
        case 1: // Sale
          items = rootState.sales.sales;
          break;
        case 3: // Turn
          items = rootState.turns.turns;
          break;
        case 5: // Purchases
          items = rootState.purchases.purchases;
          break;
      }

      let row = items.find((element) => element.id === data.id);
      if (row) {
        row.note = data.note;
      }
    },
  },
};
