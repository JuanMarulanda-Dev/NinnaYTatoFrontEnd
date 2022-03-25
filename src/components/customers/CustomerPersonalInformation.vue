<template>
  <v-row>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Documento de identidad*"
        required
        type="number"
        min="1"
        v-model="personal_infomation.dni"
        prepend-inner-icon="mdi-card-account-details-outline"
        :error-messages="dniErrors"
        @input="$v.personal_infomation.dni.$touch()"
        @blur="$v.personal_infomation.dni.$touch()"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Nombres*"
        required
        v-model="personal_infomation.first_name"
        prepend-inner-icon="mdi-alphabet-latin"
        :error-messages="first_nameErrors"
        @input="$v.personal_infomation.first_name.$touch()"
        @blur="$v.personal_infomation.first_name.$touch()"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Apellidos*"
        required
        v-model="personal_infomation.last_name"
        prepend-inner-icon="mdi-alphabet-latin"
        :error-messages="last_nameErrors"
        @input="$v.personal_infomation.last_name.$touch()"
        @blur="$v.personal_infomation.last_name.$touch()"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-radio-group
        row
        v-model="personal_infomation.gender"
        :error-messages="genderErrors"
        @input="$v.personal_infomation.gender.$touch()"
        @blur="$v.personal_infomation.gender.$touch()"
      >
        <v-radio
          color="secondary"
          on-icon="mdi-gender-female"
          label="Femenino"
          value="0"
        ></v-radio>
        <v-radio
          color="secondary"
          on-icon="mdi-gender-male"
          label="Masculino"
          value="1"
        ></v-radio>
      </v-radio-group>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Dirección"
        required
        v-model="personal_infomation.address"
        prepend-inner-icon="mdi-home-account"
        :error-messages="addressErrors"
        @input="$v.personal_infomation.address.$touch()"
        @blur="$v.personal_infomation.address.$touch()"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-select
        :items="branch_offices"
        item-text="name"
        item-value="id"
        label="Sucursal"
        v-model="personal_infomation.branch_office_id"
        append-icon="mdi-office-building-marker"
        :error-messages="branch_officeErrors"
        @input="$v.personal_infomation.branch_office_id.$touch()"
        @blur="$v.personal_infomation.branch_office_id.$touch()"
      ></v-select>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, maxLength, numeric } from "vuelidate/lib/validators";

export default {
  name: "customer-personal-information",
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
    personal_infomation: {
      dni: { required, maxLength: maxLength(255), numeric },
      first_name: { required, maxLength: maxLength(255) },
      last_name: { required, maxLength: maxLength(255) },
      gender: { required },
      address: { maxLength: maxLength(255) },
      branch_office_id: { required },
    },
  },
  computed: {
    ...mapState("customers", ["personal_infomation"]),
    ...mapState("users", ["branch_offices"]),
    dniErrors() {
      const errors = [];
      if (!this.$v.personal_infomation.dni.$dirty) return errors;
      !this.$v.personal_infomation.dni.required &&
        errors.push("El documento de identidad es requerido");
      !this.$v.personal_infomation.dni.maxLength &&
        errors.push("Longitud no permitida");
      !this.$v.personal_infomation.dni.numeric &&
        errors.push("Solo se permiten numeros");
      return errors;
    },
    first_nameErrors() {
      const errors = [];
      if (!this.$v.personal_infomation.first_name.$dirty) return errors;
      !this.$v.personal_infomation.first_name.required &&
        errors.push("Los nombres son requeridos");
      !this.$v.personal_infomation.first_name.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    last_nameErrors() {
      const errors = [];
      if (!this.$v.personal_infomation.last_name.$dirty) return errors;
      !this.$v.personal_infomation.last_name.required &&
        errors.push("Los apellidos son requeridos");
      !this.$v.personal_infomation.last_name.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    genderErrors() {
      const errors = [];
      if (!this.$v.personal_infomation.gender.$dirty) return errors;
      !this.$v.personal_infomation.gender.required &&
        errors.push("El genero es requerido");
      return errors;
    },
    addressErrors() {
      const errors = [];
      if (!this.$v.personal_infomation.address.$dirty) return errors;
      !this.$v.personal_infomation.address.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    branch_officeErrors() {
      const errors = [];
      if (!this.$v.personal_infomation.branch_office_id.$dirty) return errors;
      !this.$v.personal_infomation.branch_office_id.required &&
        errors.push("La sucursal es requerido.");
      return errors;
    },
  },
  methods: {
    ...mapActions("users", ["getBranchOfficesAvailable"]),
  },
  created() {
    this.getBranchOfficesAvailable();
  },
  watch: {
    personal_infomation: {
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
