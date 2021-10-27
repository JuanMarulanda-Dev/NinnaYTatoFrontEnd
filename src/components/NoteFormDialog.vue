<template>
  <v-dialog v-model="dialogNote" persistent max-width="500px">
    <!-- Button active modal -->
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        fab
        small
        color="secondary"
        elevation="3"
        dark
        v-bind="attrs"
        v-on="on"
        v-show="permissions.create"
      >
        <v-icon>mdi-plus-thick</v-icon>
      </v-btn>
    </template>
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          Nota - <small>Venta N°&nbsp;{{ payment_proof }}</small></span
        >
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-textarea
                name="input-7-1"
                label="Notas de la venta"
                v-model="note"
                :error-messages="noteErrors"
                @input="$v.note.$touch()"
                @blur="$v.note.$touch()"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save()">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
export default {
  name: "note-form-dialog",
  data() {
    return {
      permissions: {},
      note: "",
    };
  },
  mixins: [validationMixin],
  validations: {
    note: {
      required,
    },
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    payment_proof: {
      type: Number,
      required: true,
    },
  },
  created() {
    // Obtener los permisos
    this.permissions = this.$route.meta.permissions;
  },
  computed: {
    dialogNote: {
      get: function () {
        return this.value;
      },
      set: function (value) {
        this.$emit("input", value);
      },
    },
    noteErrors() {
      const errors = [];
      if (!this.$v.note.$dirty) return errors;
      !this.$v.note.required && errors.push("La nota es requerida");
      return errors;
    },
  },
  methods: {
    ...mapActions("notes", ["updateNote"]),
    close() {
      this.dialogNote = false;
    },
    save() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.updateNote().then((result) => {
          if (result) {
            console.log(1);
          }
        });
      }
    },
  },
};
</script>
