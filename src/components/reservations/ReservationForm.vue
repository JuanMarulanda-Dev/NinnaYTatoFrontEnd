<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="editedItem.name"
          label="Nombre*"
          required
          prepend-inner-icon="mdi-format-letter-matches"
          counter="255"
          :error-messages="nameErrors"
          @input="$v.editedItem.name.$touch()"
          @blur="$v.editedItem.name.$touch()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="editedItem.address"
          label="Dirrección*"
          prepend-inner-icon="mdi-map-marker"
          counter="255"
          :error-messages="addressErrors"
          @input="$v.editedItem.address.$touch()"
          @blur="$v.editedItem.address.$touch()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="editedItem.phone"
          label="Telefono*"
          prepend-inner-icon="mdi-phone"
          counter="255"
          :error-messages="phoneErrors"
          @input="$v.editedItem.phone.$touch()"
          @blur="$v.editedItem.phone.$touch()"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapState } from "vuex";
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
  },
  name: "reservation-form",
  mixins: [validationMixin],
  validations: {
    editedItem: {
      pet_id: { required },
      room_id: { required },
      start: { required },
      end: { required },
    },
  },
  computed: {
    ...mapState("reservations", ["editedItem", "defaultItem"]),
    petErrors() {
      const errors = [];
      if (!this.$v.editedItem.pet_id.$dirty) return errors;
      !this.$v.editedItem.pet_id.required &&
        errors.push("La mascota es requerida");
      return errors;
    },
    roomErrors() {
      const errors = [];
      if (!this.$v.editedItem.room_id.$dirty) return errors;
      !this.$v.editedItem.room_id.required &&
        errors.push("La habitación es requerida");
      return errors;
    },
    startErrors() {
      const errors = [];
      if (!this.$v.editedItem.start.$dirty) return errors;
      !this.$v.editedItem.start.required &&
        errors.push("La fecha de inicio es requerida");
      return errors;
    },
    endErrors() {
      const errors = [];
      if (!this.$v.editedItem.end.$dirty) return errors;
      !this.$v.editedItem.end.required &&
        errors.push("La fecha de fin es requerida");
      return errors;
    },
  },
  watch: {
    dialog() {
      this.$v.$reset();
    },
  },
};
</script>
