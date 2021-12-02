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
import { required, maxLength, numeric } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  validations: {
    editedItem: {
      name: { required, maxLength: maxLength(255) },
      address: { required, maxLength: maxLength(255) },
      phone: { required, numeric, maxLength: maxLength(255) },
    },
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
        errors.push("El nombre es requerido");
      !this.$v.editedItem.name.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    addressErrors() {
      const errors = [];
      if (!this.$v.editedItem.address.$dirty) return errors;
      !this.$v.editedItem.address.required &&
        errors.push("La dirección es requerido");
      !this.$v.editedItem.address.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.editedItem.phone.$dirty) return errors;
      !this.$v.editedItem.phone.required &&
        errors.push("El telefono es requerido");
      !this.$v.editedItem.phone.maxLength &&
        errors.push("Longitud no permitida");
      !this.$v.editedItem.phone.numeric &&
        errors.push("Solo se permiten numeros");
      return errors;
    },
  },
};
</script>
