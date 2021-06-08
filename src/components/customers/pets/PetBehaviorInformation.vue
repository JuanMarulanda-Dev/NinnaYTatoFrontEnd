<template>
  <v-row class="mt-5">
    <v-col xs="12" sm="6" md="3" cols="12">
      <label>Socialización</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
        v-model="pet_behavior.socialization"
      ></v-rating>
    </v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Temperamento</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
        v-model="pet_behavior.general_temperament"
      ></v-rating
    ></v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Energia</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
        v-model="pet_behavior.energy"
      ></v-rating
    ></v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Ansiedad</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
        v-model="pet_behavior.anxiety"
      ></v-rating
    ></v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Ladrido</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
        v-model="pet_behavior.bark"
      ></v-rating
    ></v-col>
    <v-col xs="12" sm="6" md="3" cols="12"
      ><label>Agresividad</label>
      <v-rating
        half-increments
        background-color="indigo lighten-3"
        color="indigo"
        v-model="pet_behavior.aggressiveness"
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

export default {
  name: "pet-behavior-information",
  data() {
    return {};
  },
  computed: {
    ...mapState("pets", ["pet_behavior"]),
  },
};
</script>
