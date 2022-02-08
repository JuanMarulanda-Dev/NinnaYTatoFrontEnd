<template>
  <v-dialog v-model="dialogMovementDetail" persistent fluid>
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline"> Detalles del movimiento </span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12"></v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close()">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("movements", [
      "movement",
      "dialogMovementDetail",
      "movement_type",
    ]),
    customeHeaders() {
      let headers = {};
      switch (this.movement_type) {
        case 1: // Sale
          break;
        case 3: // Turn
          break;
        case 5: // Purchases
          break;
      }
      return headers;
    },
  },
  methods: {
    ...mapMutations("movements", ["SET_DIALOG_MOVEMENT"]),
    close() {
      this.SET_DIALOG_MOVEMENT(false);
    },
  },
};
</script>
