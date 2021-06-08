<template>
  <v-row>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Documento de identidad"
        required
        v-model="personal_infomation.dni"
        prepend-inner-icon="mdi-card-account-details-outline"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Nombres"
        required
        v-model="personal_infomation.first_name"
        prepend-inner-icon="mdi-alphabet-latin"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Apellidos"
        required
        v-model="personal_infomation.last_name"
        prepend-inner-icon="mdi-alphabet-latin"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-radio-group row v-model="personal_infomation.gender">
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
    <v-col cols="12">
      <v-text-field
        label="Dirección"
        required
        v-model="personal_infomation.address"
        prepend-inner-icon="mdi-home-account"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "customer-personal-information",
  data() {
    return {};
  },
  computed: {
    ...mapState("customers", ["personal_infomation"]),
  },
};
</script>
