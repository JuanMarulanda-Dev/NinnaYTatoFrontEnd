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
          <v-btn
            @click="save()"
            color="secondary"
            icon
            v-bind="attrs"
            v-on="on"
          >
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
              <pet-general-information
                v-model="aviable_pet"
              ></pet-general-information>
              <v-row justify="end"> </v-row>
            </v-container>
          </v-card>
        </v-tab-item>
        <!-- Información veterinaria-->
        <v-tab-item>
          <v-card>
            <v-container class="pa-7">
              <pet-vet-information
                v-model="aviable_pet_vet_information"
              ></pet-vet-information>
            </v-container>
          </v-card>
        </v-tab-item>
        <!-- Información comportamental -->
        <v-tab-item>
          <v-card>
            <v-container class="pa-7">
              <pet-behavior-information
                v-model="aviable_pet_behavior"
              ></pet-behavior-information>
            </v-container>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import PetGeneralInformation from "@/components/customers/pets/PetGeneralInformation.vue";
import PetVetInformation from "@/components/customers/pets/PetVetInformation.vue";
import PetBehaviorInformation from "@/components/customers/pets/PetBehaviorInformation.vue";

export default {
  data() {
    return {
      tab: null,
      customerId: null,
      petId: null,
      aviable_pet: false,
      aviable_pet_behavior: false,
      aviable_pet_vet_information: false,
    };
  },
  computed: {
    ...mapState("pets", ["pet"]),
  },
  components: {
    PetGeneralInformation,
    PetVetInformation,
    PetBehaviorInformation,
  },
  methods: {
    // Pendiente colocar este metodo a funcionar
    ...mapActions(["goBack"]),
    ...mapActions("pets", ["storePet", "updatePet"]),
    ...mapMutations("pets", ["SET_PET_DEFAULT"]),
    async save() {
      if (this.aviable_pet && this.aviable_pet_behavior) {
        let response = false;
        if (this.petId == null) {
          // Guardar mascota del cliente
          response = await this.storePet(this.customerId);
        } else {
          response = await this.updatePet();
        }

        if (response) {
          this.$router.push({ path: `/clientes/detalles/${this.customerId}` });
        }
      }
    },
  },
  created() {
    this.customerId = this.$route.params.customer;
    this.petId = this.$route.params.pet;
    if (this.$route.path.includes("editar") && this.pet.id == 0) {
      this.$router.push({
        path: `/clientes/detalles/${this.$route.params.customer}`,
      });
    }

    if (this.petId != null) {
      this.aviable_pet = true;
      this.aviable_pet_behavior = true;
      this.aviable_pet_vet_information = true;
    } else {
      this.SET_PET_DEFAULT();
    }
  },
};
</script>
