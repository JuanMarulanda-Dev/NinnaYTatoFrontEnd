<template>
  <v-row>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Documento de identidad"
        required
        prepend-inner-icon="mdi-card-account-details-outline"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Nombres"
        required
        prepend-inner-icon="mdi-alphabet-latin"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Apellidos"
        required
        prepend-inner-icon="mdi-alphabet-latin"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-radio-group row>
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
  </v-row>
</template>

<script>
export default {
  name: "customer-personal-information",
  data() {
    return {};
  },
};
</script>
