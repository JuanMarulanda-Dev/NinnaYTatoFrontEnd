<template>
  <v-data-table
    :headers="headers"
    :items="customers"
    sort-by="name"
    class="elevation-3"
    :search="search"
    :loading="loading"
    :loading-text="loadingText"
  >
    <template v-slot:top>
      <v-toolbar flat color="white" class="rounded-xl">
        <!-- Search Field -->
        <v-toolbar-title>
          <v-icon large>mdi-paw</v-icon> Clientes
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
        <!-- Create Button -->
        <v-tooltip bottom v-show="permissions.create">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ml-3"
              fab
              small
              color="secondary"
              elevation="3"
              dark
              v-bind="attrs"
              v-on="on"
              @click="goToFormCreateCustomer()"
            >
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>
          </template>
          <span>Crear</span>
        </v-tooltip>
      </v-toolbar>
    </template>

    <!-- Avatar + nombre -->
    <template v-slot:[`item.name`]="{ item }">
      <!-- Image profile -->
      <v-avatar v-if="item.avatar" class="my-2 mr-1">
        <img :src="item.avatar" :alt="item.name" />
      </v-avatar>

      <!-- Icon profile -->
      <v-avatar v-else color="grey lighten-1" class="my-2 mr-1">
        <v-icon dark> mdi-account-circle </v-icon>
      </v-avatar>
      <span>
        {{ item.name }}
      </span>
    </template>

    <!-- State -->
    <template v-slot:[`item.state`]="{ item }">
      <v-switch
        :input-value="item.state"
        v-model="item.state"
        @change="changeCustomerState(item)"
        v-show="permissions.delete"
      ></v-switch>
    </template>

    <!-- Debts -->
    <template v-slot:[`item.debts`]="{ item }">
      <v-icon small>
        {{ moneyIcon }}
      </v-icon>
      {{ currencyFormat(item.debts) }}
    </template>

    <!-- Actions -->
    <template v-slot:[`item.actions`]="{ item }">
      <!-- Detalles sucursal -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            x-small
            dark
            color="info"
            v-bind="attrs"
            v-on="on"
            @click="goToCustomerDetails(item.id)"
          >
            <v-icon> {{ detailsIcon }} </v-icon>
          </v-btn>
        </template>
        <span>Detalles</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";

export default {
  data() {
    return {
      search: "",
      headers: [
        { text: "Cliente", value: "name" },
        { text: "DNI", value: "dni" },
        { text: "Telefono", value: "phone" },
        { text: "Email", value: "email" },
        { text: "Estado", value: "state" },
        { text: "Deuda", value: "debts" },
        { text: "Acciones", value: "actions", align: "start", sortable: false },
      ],
    };
  },
  mixins: [moneyFormatMixin],
  computed: {
    ...mapState([
      "detailsIcon",
      "loadingText",
      "loadingText",
      "mainBranchOffice",
    ]),
    ...mapState("customers", ["customers", "loading", "permissions"]),
  },
  created() {
    // Obtener los permisos
    this.SET_PERMISSIONS(this.$route.meta.permissions);
    // Acciones que debe realizar el componente una vez creado
    if (this.permissions.read) {
      this.initialize();
    }
  },
  watch: {
    mainBranchOffice() {
      if (this.permissions.read) {
        this.initialize();
      }
    },
  },
  methods: {
    ...mapActions("customers", ["getAllCustomers", "changeStatusCustomers"]),
    ...mapMutations("customers", ["SET_PERMISSIONS"]),
    initialize() {
      this.getAllCustomers();
    },
    changeCustomerState(item) {
      // Confirmation to change de status
      this.$confirm("¿Quieres cambiar el estado de este cliente?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Make to change status to backend
          this.changeStatusCustomers(item.user_id).then((result) => {
            if (!result) {
              // Rollback the state from branch office
              this.rollbackCustomer(item);
            }
          });
        } else {
          // Rollback the state from branch office
          this.rollbackCustomer(item);
        }
      });
    },
    rollbackCustomer(item) {
      let customerIndex = this.customers.indexOf(item);
      let state = !this.customers[customerIndex].state;
      this.customers[customerIndex].state = state;
    },
    goToFormCreateCustomer() {
      this.$router.push({ path: "/clientes/registro" }).catch((error) => {
        console.log(error);
      });
    },
    goToCustomerDetails(id) {
      this.$router.push({ path: `/clientes/detalles/${id}` }).catch((error) => {
        console.log(error);
      });
    },
  },
};
</script>
