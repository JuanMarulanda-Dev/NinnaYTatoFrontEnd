<template>
  <v-row>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="E-mail"
        required
        v-model="contact_information.email"
        prepend-inner-icon="mdi-email-outline"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Teléfono"
        required
        v-model="contact_information.phone"
        prepend-inner-icon="mdi-phone"
        type="number"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Nombre contacto de emergencia"
        required
        v-model="contact_information.emergency_conctact_name"
        prepend-inner-icon="mdi-alphabet-latin"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Teléfono"
        required
        v-model="contact_information.emergency_conctact_phone"
        prepend-inner-icon="mdi-phone"
        type="number"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Nombre contacto de respaldo"
        required
        v-model="contact_information.backup_conctact_name"
        prepend-inner-icon="mdi-alphabet-latin"
      ></v-text-field>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-text-field
        label="Teléfono"
        required
        v-model="contact_information.backup_conctact_phone"
        prepend-inner-icon="mdi-phone"
        type="number"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "customer-contact-information",
  data() {
    return {};
  },
  computed: {
    ...mapState("customers", ["contact_information"]),
  },
};
</script>
