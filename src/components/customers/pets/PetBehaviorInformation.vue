<template>
  <v-row class="mt-5">
    <v-col xs="12" sm="6" md="3" cols="12">
      <label>Socialización</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
      ></v-rating>
    </v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Temperamento</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
      ></v-rating
    ></v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Energia</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
      ></v-rating
    ></v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Ansiedad</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
      ></v-rating
    ></v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Ladrido</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
      ></v-rating
    ></v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Agresividad</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
      ></v-rating
    ></v-col>
    <v-col xs="12" sm="6" md="3" cols="12">
      <label>Monta</label>
      <v-switch></v-switch>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "pet-behavior-information",
  data() {
    return {};
  },
};
</script>
