<template>
  <v-row>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="E-mail*"
        required
        v-model="contact_information.email"
        prepend-inner-icon="mdi-email-outline"
        :error-messages="emailErrors"
        @input="$v.contact_information.email.$touch()"
        @blur="$v.contact_information.email.$touch()"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Teléfono*"
        required
        v-model="contact_information.phone"
        prepend-inner-icon="mdi-phone"
        type="number"
        :error-messages="phoneErrors"
        @input="$v.contact_information.phone.$touch()"
        @blur="$v.contact_information.phone.$touch()"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Nombre contacto de emergencia"
        required
        v-model="contact_information.emergency_contact_name"
        prepend-inner-icon="mdi-alphabet-latin"
        :error-messages="emergency_contact_nameErrors"
        @input="$v.contact_information.emergency_contact_name.$touch()"
        @blur="$v.contact_information.emergency_contact_name.$touch()"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Teléfono"
        required
        v-model="contact_information.emergency_contact_phone"
        prepend-inner-icon="mdi-phone"
        type="number"
        :error-messages="emergency_contact_phoneErrors"
        @input="$v.contact_information.emergency_contact_phone.$touch()"
        @blur="$v.contact_information.emergency_contact_phone.$touch()"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Nombre contacto de respaldo"
        required
        v-model="contact_information.backup_contact_name"
        prepend-inner-icon="mdi-alphabet-latin"
        :error-messages="backup_contact_nameErrors"
        @input="$v.contact_information.backup_contact_name.$touch()"
        @blur="$v.contact_information.backup_contact_name.$touch()"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Teléfono"
        required
        v-model="contact_information.backup_contact_phone"
        prepend-inner-icon="mdi-phone"
        type="number"
        :error-messages="backup_contact_phoneErrors"
        @input="$v.contact_information.backup_contact_phone.$touch()"
        @blur="$v.contact_information.backup_contact_phone.$touch()"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import { validationMixin } from "vuelidate";
import { required, maxLength, numeric, email } from "vuelidate/lib/validators";

export default {
  name: "customer-contact-information",
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
    contact_information: {
      email: { required, maxLength: maxLength(255), email },
      phone: { required, maxLength: maxLength(255), numeric },
      emergency_contact_name: { maxLength: maxLength(255) },
      emergency_contact_phone: {
        maxLength: maxLength(255),
        numeric,
      },
      backup_contact_name: { maxLength: maxLength(255) },
      backup_contact_phone: { maxLength: maxLength(255), numeric },
    },
  },
  computed: {
    ...mapState("customers", ["contact_information"]),
    emailErrors() {
      const errors = [];
      if (!this.$v.contact_information.email.$dirty) return errors;
      !this.$v.contact_information.email.required &&
        errors.push("El e-mail es requerido");
      !this.$v.contact_information.email.maxLength &&
        errors.push("Longitud no permitida");
      !this.$v.contact_information.email.email &&
        errors.push("E-mail no valido");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.contact_information.phone.$dirty) return errors;
      !this.$v.contact_information.phone.required &&
        errors.push("El teléfono es requerido");
      !this.$v.contact_information.phone.maxLength &&
        errors.push("Longitud no permitida");
      !this.$v.contact_information.phone.numeric &&
        errors.push("Solo se permiten numeros");
      return errors;
    },
    emergency_contact_phoneErrors() {
      const errors = [];
      if (!this.$v.contact_information.emergency_contact_phone.$dirty)
        return errors;
      !this.$v.contact_information.emergency_contact_phone.maxLength &&
        errors.push("Longitud no permitida");
      !this.$v.contact_information.emergency_contact_phone.numeric &&
        errors.push("Solo se permiten numeros");
      return errors;
    },
    emergency_contact_nameErrors() {
      const errors = [];
      if (!this.$v.contact_information.emergency_contact_name.$dirty)
        return errors;
      !this.$v.contact_information.emergency_contact_name.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    backup_contact_phoneErrors() {
      const errors = [];
      if (!this.$v.contact_information.backup_contact_phone.$dirty)
        return errors;
      !this.$v.contact_information.backup_contact_phone.maxLength &&
        errors.push("Longitud no permitida");
      !this.$v.contact_information.backup_contact_phone.numeric &&
        errors.push("Solo se permiten numeros");
      return errors;
    },
    backup_contact_nameErrors() {
      const errors = [];
      if (!this.$v.contact_information.backup_contact_name.$dirty)
        return errors;
      !this.$v.contact_information.backup_contact_name.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
  },
  watch: {
    contact_information: {
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
