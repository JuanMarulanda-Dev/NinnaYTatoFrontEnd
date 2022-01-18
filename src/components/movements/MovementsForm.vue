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
      <v-col cols="12">
        <vuetify-money v-model="editedItem.price" label="Valor Unidad*" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "movements-form",
  data() {
    return {};
  },
};
</script>
