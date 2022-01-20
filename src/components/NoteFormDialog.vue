<template>
  <v-dialog v-model="dialogNote" persistent max-width="500px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          Nota - <small>{{ title }}</small></span
        >
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-textarea
                name="input-7-1"
                label="Notas"
                v-model="description"
                :error-messages="descriptionErrors"
                @input="$v.description.$touch()"
                @blur="$v.description.$touch()"
                counter="500"
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
import { maxLength } from "vuelidate/lib/validators";
export default {
  name: "note-form-dialog",
  data() {
    return {
      permissions: {},
      description: "",
    };
  },
  mixins: [validationMixin],
  validations: {
    description: {
      maxLength: maxLength(500),
    },
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    title: {
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

    descriptionErrors() {
      const errors = [];
      if (!this.$v.description.$dirty) return errors;
      !this.$v.description.maxLength &&
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
    close() {
      this.dialogNote = false;
    },
    save() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.storeNote({
          item_id: this.id,
          item_type: this.type,
          description: this.description,
        }).then((result) => {
          if (result) {
            this.close();
            this.$emit("saved", this.description);
          }
        });
      }
    },
  },
};
</script>
