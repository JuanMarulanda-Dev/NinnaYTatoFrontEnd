<template>
  <v-dialog v-model="dialogPetDetails" persistent max-width="700px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon large>mdi-transit-transfer</v-icon>
          Detalle de la mascota <small>({{ pet.name }})</small>
        </span>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="4" sm="6">
              <v-avatar
                tile
                size="160"
                color="grey lighten-1"
                class="my-2 mr-1"
              >
                <img v-if="pet.pet_avatar" :src="pet.pet_avatar" alt="avatar" />
                <v-icon v-else dark x-large> mdi-dog-side </v-icon>
              </v-avatar>
            </v-col>

            <v-col xs="12" sm="12" md="8" cols="12">
              <v-row>
                <!-- Raza -->
                <v-col xs="12" sm="4" md="4" cols="12">
                  <small>Raza</small><br />
                  <label> {{ pet.pet_breed }} </label>
                </v-col>
                <!-- Fecha de nacimiento -->
                <v-col xs="12" sm="4" md="4" cols="12">
                  <small>Nacimiento</small><br />
                  <label> {{ pet.pet_birth_date }} </label>
                </v-col>
                <!-- Fecha de nacimiento -->
                <v-col xs="12" sm="4" md="4" cols="12">
                  <small>Edad</small><br />
                  <label> {{ pet.pet_age }} </label>
                </v-col>
              </v-row>
              <v-row>
                <!-- Numero de Chip -->
                <v-col xs="12" sm="4" md="4" cols="12">
                  <small>Chip</small><br />
                  <label> {{ pet.pet_chip_number }} </label>
                </v-col>
                <!-- Pelaje -->
                <v-col xs="12" sm="4" md="4" cols="12">
                  <small>Pelaje</small><br />
                  <label> {{ pet.pet_fur }} </label>
                </v-col>
                <!-- Tamaño -->
                <v-col xs="12" sm="4" md="4" cols="12">
                  <small>Tamaño</small><br />
                  <label> {{ pet.pet_size }} </label>
                </v-col>
              </v-row>
              <v-row>
                <!-- Alimento -->
                <v-col xs="12" sm="4" md="4" cols="12">
                  <small>Alimento</small><br />
                  <label> {{ pet.pet_food }} </label>
                </v-col>
                <!-- Esterilización -->
                <v-col xs="12" sm="4" md="4" cols="12">
                  <small>Esterilización </small><br />
                  <label>
                    {{ pet.pet_sterilized == "1" ? "SI" : "No" }}
                  </label>
                </v-col>
                <!-- ¿Monta? -->
                <v-col xs="12" sm="4" md="4" cols="12">
                  <small>Monta</small><br />
                  <label> {{ pet.ride ? "SI" : "No" }} </label>
                </v-col>
              </v-row>
              <v-row>
                <!-- Instrucciones generales -->
                <v-col cols="12">
                  <small>Instrucciones generales</small><br />
                  <label>
                    {{ pet.pet_general_instructions }}
                  </label>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close()"> Cerrar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "entry-pet-details",
  data() {
    return {};
  },
  model: { prop: "value", event: "input" },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    pet: {
      type: Object,
      required: true,
    },
  },
  computed: {
    dialogPetDetails: {
      get: function () {
        return this.value;
      },
      set: function (newValue) {
        this.$emit("input", newValue);
      },
    },
  },

  methods: {
    close() {
      // Close modal
      this.dialogPetDetails = false;
    },
  },
};
</script>
