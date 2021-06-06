<template>
  <div>
    <!-- titel -->
    <v-row class="my-1 mr-1" align="center" justify="space-between">
      <div class="d-flex">
        <v-btn icon @click="goBack()">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <h2>
          {{ petId == null ? "Registrar" : "Editar" }} mascota&nbsp;<v-icon
            large
          >
            mdi-paw
          </v-icon>
        </h2>
      </div>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="secondary" icon v-bind="attrs" v-on="on">
            <v-icon>mdi-check-bold</v-icon>
          </v-btn>
        </template>
        <span>Guardar</span>
      </v-tooltip>
    </v-row>
    <v-card>
      <v-tabs v-model="tab" background-color="secondary" dark>
        <v-tab> Información General </v-tab>
        <v-tab> Información veterinaria </v-tab>
        <v-tab> Información Comportamental </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <!-- Información general-->
        <v-tab-item>
          <v-card>
            <v-container class="pa-7">
              <pet-general-information></pet-general-information>
              <v-row justify="end"> </v-row>
            </v-container>
          </v-card>
        </v-tab-item>
        <!-- Información veterinaria-->
        <v-tab-item>
          <v-card>
            <v-container class="pa-7">
              <pet-vet-information></pet-vet-information>
            </v-container>
          </v-card>
        </v-tab-item>
        <!-- Información comportamental -->
        <v-tab-item>
          <v-card>
            <v-container class="pa-7">
              <pet-behavior-information></pet-behavior-information>
            </v-container>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import PetGeneralInformation from "@/components/customers/pets/PetGeneralInformation.vue";
import PetVetInformation from "@/components/customers/pets/PetVetInformation.vue";
import PetBehaviorInformation from "@/components/customers/pets/PetBehaviorInformation.vue";

export default {
  data() {
    return {
      tab: null,
      petId: null,
    };
  },
  created() {
    this.petId = this.$route.params.pet;
  },
  components: {
    PetGeneralInformation,
    PetVetInformation,
    PetBehaviorInformation,
  },
  methods: {
    // Pendiente colocar este metodo a funcionar
    ...mapActions(["goBack"]),
  },
};
</script>
