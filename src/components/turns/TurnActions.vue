<!-- Actions -->
<template>
  <div>
    <!-- Eliminar -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          x-small
          dark
          color="error mr-1"
          v-bind="attrs"
          v-on="on"
          @click="deleteItem(item.id)"
          v-show="permissions.delete"
        >
          <v-icon> {{ deleteIcon }} </v-icon>
        </v-btn>
      </template>
      <span>Eliminar</span>
    </v-tooltip>

    <!-- Edit -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          x-small
          dark
          color="secondary mr-1"
          v-bind="attrs"
          v-on="on"
          @click="editItem(item)"
          v-show="permissions.update"
        >
          <v-icon> {{ editIcon }} </v-icon>
        </v-btn>
      </template>
      <span>Editar</span>
    </v-tooltip>

    <!-- Notes -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          x-small
          dark
          color="info"
          v-bind="attrs"
          v-on="on"
          @click="
            showNoteFormDialog(item.id, item.name, item.note, item.note_type)
          "
        >
          <v-icon>mdi-note-text</v-icon>
        </v-btn>
      </template>
      <span>Nota</span>
    </v-tooltip>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      note_type: 3,
    };
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    permissions: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(["deleteIcon", "editIcon"]),
    ...mapState("turns", ["editedIndex", "turns"]),
    ...mapState("notes", ["dialogNoteForm"]),
  },
  methods: {
    ...mapMutations("turns", [
      "SET_FORM_DIALOG",
      "SET_EDIT_ITEM",
      "SET_EDITED_INDEX",
    ]),
    ...mapMutations("notes", ["SET_EDIT_ITEM_NOTE", "SET_DIALOG_NOTE_FORM"]),
    ...mapActions("turns", ["getAllTurns", "deleteTurn"]),

    editItem(item) {
      this.SET_EDITED_INDEX(this.turns.indexOf(item));
      this.SET_EDIT_ITEM(Object.assign({}, item));
      this.SET_FORM_DIALOG(true);
    },

    deleteItem(id) {
      this.$confirm(`¿Seguro quieres eliminar este turno?`, {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          this.deleteTurn(id).then((result) => {
            if (result) {
              this.getAllTurns();
            }
          });
        }
      });
    },

    showNoteFormDialog(id, title, note) {
      this.SET_EDIT_ITEM_NOTE({
        id,
        title: "Turno: " + title,
        note,
        type: this.note_type,
      });
      this.SET_DIALOG_NOTE_FORM(true);
    },
  },
};
</script>
