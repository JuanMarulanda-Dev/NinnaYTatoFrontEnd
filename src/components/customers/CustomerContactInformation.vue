<template>
  <v-row>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="E-mail"
        required
        prepend-inner-icon="mdi-email-outline"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Teléfono"
        required
        prepend-inner-icon="mdi-phone"
        type="number"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Nombre contacto de emergencia"
        required
        prepend-inner-icon="mdi-alphabet-latin"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Teléfono"
        required
        prepend-inner-icon="mdi-phone"
        type="number"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Nombre contacto de respaldo"
        required
        prepend-inner-icon="mdi-alphabet-latin"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Teléfono"
        required
        prepend-inner-icon="mdi-phone"
        type="number"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "customer-contact-information",
  data() {
    return {};
  },
};
</script>
