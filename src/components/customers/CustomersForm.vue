<template>
  <div>
    <!-- titel -->
    <v-row class="my-1" align="center">
      <v-btn icon @click="goBack()">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
      <h2>Formulario de clientes&nbsp;<v-icon large>mdi-paw</v-icon></h2>
    </v-row>

    <v-stepper alt-labels v-model="step">
      <v-stepper-header>
        <v-stepper-step color="secondary" :complete="step > 1" step="1">
          Info personal
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="secondary" :complete="step > 2" step="2">
          Info de contacto
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="secondary" :complete="step > 3" step="3">
          Datos adicionales
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="secondary" :complete="step > 4" step="4">
          Mascota
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="secondary" :complete="step > 5" step="5">
          Info veterinaria
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="secondary" :complete="step > 6" step="6">
          Comportamental
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <!-- Info Personal -->
        <v-stepper-content step="1">
          <v-container>
            <v-row justify="center">
              <h4 color="secondary">Información Personal</h4>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
            <!-- Formulario -->
            <customer-personal-information></customer-personal-information>
            <v-row justify="end">
              <v-btn color="secondary" @click="step = 2"> Continue </v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>

        <!-- Información de contacto -->
        <v-stepper-content step="2">
          <v-container>
            <v-row justify="center">
              <h4 color="secondary">Información de contacto</h4>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
            <!-- Formulario -->
            <customer-contact-information></customer-contact-information>
            <v-row justify="end">
              <v-btn class="mr-3" @click="step--"> volver </v-btn>
              <v-btn color="secondary" @click="step++"> Continue </v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>

        <!-- Datos adicionales -->
        <v-stepper-content step="3">
          <v-container>
            <v-row justify="center">
              <h4 color="secondary">Datos Adicionales</h4>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
            <!-- Formulario -->
            <customer-additional-information></customer-additional-information>
            <v-row justify="end">
              <v-btn class="mr-3" @click="step--"> volver </v-btn>
              <v-btn color="secondary" @click="step++"> Continue </v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>

        <!-- Registrar mascota -->
        <v-stepper-content step="4">
          <v-container>
            <v-row justify="center">
              <h4 color="secondary">Registrar Mascota</h4>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
            <!-- Formulario -->
            <pet-general-information></pet-general-information>
            <!-- back - next -->
            <v-row justify="end">
              <v-btn class="mr-3" @click="step--"> volver </v-btn>
              <v-btn color="secondary" @click="step++"> Continue </v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>

        <!-- Info Veterinaria -->
        <v-stepper-content step="5">
          <v-container>
            <v-row justify="center">
              <h4 color="secondary">Información Veterinaria</h4>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
            <!-- Formulario -->
            <pet-vet-information></pet-vet-information>
            <!-- back - next -->
            <v-row justify="end">
              <v-btn class="mr-3" @click="step--"> volver </v-btn>
              <v-btn color="secondary" @click="step++"> Continue </v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>

        <!-- Comportamental -->
        <v-stepper-content step="6">
          <v-container>
            <v-row justify="center">
              <h4 color="secondary">Información Comportamental</h4>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
            <!-- Formulario -->
            <pet-behavior-information></pet-behavior-information>
            <!-- back - next -->
            <v-row justify="end">
              <v-btn class="mr-3" @click="step--"> volver </v-btn>
              <v-btn color="secondary"> Finalizar </v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CustomerPersonalInformation from "@/components/customers/CustomerPersonalInformation.vue";
import CustomerContactInformation from "@/components/customers/CustomerContactInformation.vue";
import CustomerAdditionalInformation from "@/components/customers/CustomerAdditionalInformation.vue";
import PetGeneralInformation from "@/components/customers/pets/PetGeneralInformation.vue";
import PetVetInformation from "@/components/customers/pets/PetVetInformation.vue";
import PetBehaviorInformation from "@/components/customers/pets/PetBehaviorInformation.vue";

export default {
  data() {
    return {
      step: 1,
    };
  },
  components: {
    CustomerPersonalInformation,
    CustomerContactInformation,
    CustomerAdditionalInformation,
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

<style scoped>
@media (max-width: 320px) {
  .v-stepper--alt-labels .v-stepper__step {
    flex-basis: 157px !important;
  }
}
@media (min-width: 375px) {
  .v-stepper--alt-labels .v-stepper__step {
    flex-basis: 167px !important;
  }
}
</style>
