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
          <v-btn
            @click="update()"
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
        <v-tab> Información Personal </v-tab>
        <v-tab> Información de contacto </v-tab>
        <v-tab> Datos adicionales </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <!-- Información Personal-->
        <v-tab-item>
          <v-card>
            <v-container class="pa-7">
              <customer-personal-information
                v-model="aviable_personal_information"
              ></customer-personal-information>
              <v-row justify="end"> </v-row>
            </v-container>
          </v-card>
        </v-tab-item>
        <!-- Información de contacto-->
        <v-tab-item>
          <v-card>
            <v-container class="pa-7">
              <customer-contact-information
                v-model="aviable_contact_information"
              ></customer-contact-information>
            </v-container>
          </v-card>
        </v-tab-item>
        <!-- Datos adicional-->
        <v-tab-item>
          <v-card>
            <v-container class="pa-7">
              <customer-additional-information
                v-model="aviable_additional_information"
              ></customer-additional-information>
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
      aviable_personal_information: true,
      aviable_contact_information: true,
      aviable_additional_information: true,
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
    ...mapActions("customers", ["updateCustomer"]),
    async update() {
      if (
        this.aviable_personal_information &&
        this.aviable_contact_information &&
        this.aviable_additional_information
      ) {
        //   // Guardar el cliente con su mascota
        let response = await this.updateCustomer();

        if (response) {
          this.$router.push({ path: "/clientes" });
        }
      }
    },
  },
};
</script>
