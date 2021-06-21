<template>
  <v-row class="mt-5">
    <v-col xs="12" sm="6" md="3" cols="12">
      <label>Socialización*</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
        v-model="pet_behavior.socialization"
        :error-messages="socializationErrors"
        @input="$v.pet_behavior.socialization.$touch()"
        @blur="$v.pet_behavior.socialization.$touch()"
      ></v-rating>
    </v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Temperamento*</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
        v-model="pet_behavior.general_temperament"
        :error-messages="general_temperamentErrors"
        @input="$v.pet_behavior.general_temperament.$touch()"
        @blur="$v.pet_behavior.general_temperament.$touch()"
      ></v-rating
    ></v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Energia*</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
        v-model="pet_behavior.energy"
        :error-messages="energyErrors"
        @input="$v.pet_behavior.energy.$touch()"
        @blur="$v.pet_behavior.energy.$touch()"
      ></v-rating
    ></v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Ansiedad*</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
        v-model="pet_behavior.anxiety"
        :error-messages="anxietyErrors"
        @input="$v.pet_behavior.anxiety.$touch()"
        @blur="$v.pet_behavior.anxiety.$touch()"
      ></v-rating
    ></v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Ladrido*</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
        v-model="pet_behavior.bark"
        :error-messages="barkErrors"
        @input="$v.pet_behavior.bark.$touch()"
        @blur="$v.pet_behavior.bark.$touch()"
      ></v-rating
    ></v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Agresividad*</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
        v-model="pet_behavior.aggressiveness"
        :error-messages="aggressivenessErrors"
        @input="$v.pet_behavior.aggressiveness.$touch()"
        @blur="$v.pet_behavior.aggressiveness.$touch()"
      ></v-rating
    ></v-col>
    <v-col xs="12" sm="6" md="3" cols="12">
      <label>Monta</label>
      <v-switch v-model="pet_behavior.ride"></v-switch>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "pet-behavior-information",
  data() {
    return {};
  },
  props: {
    // Use "value" to enable using v-model
    value: Boolean,
    validation: Boolean,
  },
  mixins: [validationMixin],
  validations: {
    pet_behavior: {
      socialization: { required },
      energy: { required },
      bark: { required },
      anxiety: { required },
      aggressiveness: { required },
      general_temperament: { required },
    },
  },
  computed: {
    ...mapState("pets", ["pet_behavior"]),
    socializationErrors() {
      const errors = [];
      if (!this.$v.pet_behavior.socialization.$dirty) return errors;
      !this.$v.pet_behavior.socialization.required &&
        errors.push("La socialización es requerida");
      return errors;
    },
    energyErrors() {
      const errors = [];
      if (!this.$v.pet_behavior.energy.$dirty) return errors;
      !this.$v.pet_behavior.energy.required &&
        errors.push("La energy es requerida");
      return errors;
    },
    barkErrors() {
      const errors = [];
      if (!this.$v.pet_behavior.bark.$dirty) return errors;
      !this.$v.pet_behavior.bark.required &&
        errors.push("El ladrido es requerido");
      return errors;
    },
    anxietyErrors() {
      const errors = [];
      if (!this.$v.pet_behavior.anxiety.$dirty) return errors;
      !this.$v.pet_behavior.anxiety.required &&
        errors.push("La ansiedad es requerida");
      return errors;
    },
    aggressivenessErrors() {
      const errors = [];
      if (!this.$v.pet_behavior.aggressiveness.$dirty) return errors;
      !this.$v.pet_behavior.aggressiveness.required &&
        errors.push("La agresividad es requerida");
      return errors;
    },
    general_temperamentErrors() {
      const errors = [];
      if (!this.$v.pet_behavior.general_temperament.$dirty) return errors;
      !this.$v.pet_behavior.general_temperament.required &&
        errors.push("El temperamento es requerido");
      return errors;
    },
  },
  watch: {
    pet_behavior: {
      handler: function () {
        // // Correct validations
        this.$emit("input", !this.$v.$invalid);
      },
      deep: true,
    },
    validation: function () {
      // Active vue validate to this form.
      this.$v.$touch();
    },
  },
};
</script>
