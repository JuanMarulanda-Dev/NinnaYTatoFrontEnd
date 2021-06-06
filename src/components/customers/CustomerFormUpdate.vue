<template>
  <div>
    <!-- titel -->
    <v-row class="my-1 mr-1" align="center" justify="space-between">
      <div class="d-flex">
        <v-btn icon @click="goBack()">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <h2>Editar cliente&nbsp;<v-icon large>mdi-account</v-icon></h2>
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
        <v-tab> Información Personal </v-tab>
        <v-tab> Información de contacto </v-tab>
        <v-tab> Datos adicionales </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <!-- Información Personal-->
        <v-tab-item>
          <v-card>
            <v-container class="pa-7">
              <customer-personal-information></customer-personal-information>
              <v-row justify="end"> </v-row>
            </v-container>
          </v-card>
        </v-tab-item>
        <!-- Información de contacto-->
        <v-tab-item>
          <v-card>
            <v-container class="pa-7">
              <customer-contact-information></customer-contact-information>
            </v-container>
          </v-card>
        </v-tab-item>
        <!-- Datos adicional-->
        <v-tab-item>
          <v-card>
            <v-container class="pa-7">
              <customer-additional-information></customer-additional-information>
            </v-container>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CustomerPersonalInformation from "@/components/customers/CustomerPersonalInformation.vue";
import CustomerContactInformation from "@/components/customers/CustomerContactInformation.vue";
import CustomerAdditionalInformation from "@/components/customers/CustomerAdditionalInformation.vue";

export default {
  data() {
    return {
      tab: null,
    };
  },
  components: {
    CustomerPersonalInformation,
    CustomerContactInformation,
    CustomerAdditionalInformation,
  },
  methods: {
    // Pendiente colocar este metodo a funcionar
    ...mapActions(["goBack"]),
  },
};
</script>
