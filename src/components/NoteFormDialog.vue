<template>
  <v-dialog v-model="dialogNote" persistent max-width="500px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          Nota - <small>{{ noteItem.title }}</small></span
        >
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-textarea
                name="input-7-1"
                label="Notas"
                v-model="noteItem.note"
                :error-messages="noteErrors"
                @input="$v.noteItem.note.$touch()"
                @blur="$v.noteItem.note.$touch()"
                counter="500"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save()">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { validationMixin } from "vuelidate";
import { maxLength, required } from "vuelidate/lib/validators";
export default {
  name: "note-form-dialog",
  data() {
    return {
      permissions: {},
    };
  },
  mixins: [validationMixin],
  validations: {
    noteItem: {
      type: { required },
      id: { required },
      note: { maxLength: maxLength(500) },
    },
  },
  created() {
    // Obtener los permisos
    this.permissions = this.$route.meta.permissions;
  },
  computed: {
    dialogNote: {
      get: function () {
        return this.dialogNoteForm;
      },
      set: function (value) {
        this.SET_DIALOG_NOTE_FORM(value);
      },
    },

    ...mapState("notes", ["dialogNoteForm", "noteItem"]),

    noteErrors() {
      const errors = [];
      if (!this.$v.noteItem.note.$dirty) return errors;
      !this.$v.noteItem.note.maxLength &&
        errors.push("La longitud no es permitida");
      return errors;
    },
  },
  watch: {
    note(newValue) {
      this.description = newValue;
    },
  },
  methods: {
    ...mapActions("notes", ["storeNote"]),
    ...mapMutations("notes", ["SET_DIALOG_NOTE_FORM"]),
    close() {
      this.dialogNote = false;
    },
    save() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.storeNote({
          item_id: this.noteItem.id,
          item_type: this.noteItem.type,
          description: this.noteItem.note,
        }).then((result) => {
          if (result) {
            this.$emit("saved", {
              note: this.noteItem.note,
              id: this.noteItem.id,
              type: this.noteItem.type,
            });
            this.close();
          }
        });
      }
    },
  },
};
</script>
