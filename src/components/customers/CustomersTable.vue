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
        <v-tooltip bottom>
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
              v-show="permissions.create"
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
        @change="changeStateSucursal(item)"
        v-show="permissions.delete"
      ></v-switch>
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
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      permissions: {},
      search: "",
      headers: [
        { text: "Cliente", value: "name" },
        { text: "DNI", value: "dni" },
        { text: "Telefono", value: "phone" },
        { text: "Email", value: "email" },
        { text: "Estado", value: "state" },
        { text: "Acciones", value: "actions", align: "start", sortable: false },
      ],
    };
  },
  computed: {
    ...mapState(["detailsIcon", "loadingText", "loadingText"]),
    ...mapState("customers", ["customers", "loading"]),
  },
  created() {
    // Obtener los permisos
    this.permissions = this.$route.meta.permissions;
    // Acciones que debe realizar el componente una vez creado
    if (this.permissions.read) {
      this.initialize();
    }
  },
  methods: {
    ...mapActions("customers", ["getAllCustomers"]),
    initialize() {
      this.getAllCustomers();
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
