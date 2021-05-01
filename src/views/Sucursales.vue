<template>
  <v-data-table
    fixed-header
    :headers="headers"
    :items="sucursales"
    sort-by="name"
    class="elevation-3"
    :loading="loading"
    :loading-text="loadingText"
  >
    <!-- Header content datatable -->
    <template v-slot:top>
      <v-toolbar flat color="white" class="rounded-xl">
        <!-- Title Module -->
        <v-toolbar-title>
          <v-icon large>mdi-home-group</v-icon> Sucursales
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <!-- Modal New/edit-->
        <v-dialog v-model="dialog" persistent max-width="500px">
          <!-- Button active modal -->
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="secondary"
              elevation="3"
              dark
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>
          </template>
          <!-- Modal Form -->
          <v-card>
            <v-card-title>
              <span class="headline">
                <v-icon large>mdi-home-group</v-icon>
                {{ formTitle }}
              </span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Nombre*"
                      required
                      prepend-inner-icon="mdi-format-letter-matches"
                      counter="50"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-switch
                      label="Estado"
                      v-model="editedItem.state"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.address"
                      label="Dirrección*"
                      prepend-inner-icon="mdi-map-marker"
                      counter="70"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.phone"
                      label="Telefono*"
                      prepend-inner-icon="mdi-phone"
                      counter="13"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <!-- State -->
    <template v-slot:[`item.state`]="{ item }">
      <v-switch
        :input-value="item.state"
        @change="changeStateSucursal(item)"
      ></v-switch>
    </template>

    <!-- Actions -->
    <template v-slot:[`item.actions`]="{ item }">
      <!-- Editar -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            x-small
            dark
            color="secondary mr-1"
            v-bind="attrs"
            v-on="on"
            @click="editItem(item)"
          >
            <v-icon> {{ editIcon }} </v-icon>
          </v-btn>
        </template>
        <span>Editar</span>
      </v-tooltip>

      <!-- Eliminar -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            x-small
            dark
            color="error mr-1"
            v-bind="attrs"
            v-on="on"
            @click="deleteItem(item)"
          >
            <v-icon> {{ deleteIcon }} </v-icon>
          </v-btn>
        </template>
        <span>Eliminar</span>
      </v-tooltip>

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
            @click="goToShowDetailSucursal(item)"
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
import { mapState } from "vuex";

export default {
  data: () => ({
    dialog: false,
    loading: false,
    loadingText: "Cargando datos...",
    headers: [
      {
        text: "Nombre",
        align: "start",
        value: "name",
      },
      { text: "Dirección", value: "address" },
      { text: "Telefono", value: "phone" },
      { text: "Estado", value: "state" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    sucursales: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: "",
      address: "",
      phone: "",
      state: false,
    },
    defaultItem: {
      id: 0,
      name: "",
      address: "",
      phone: "",
      state: false,
    },
  }),

  computed: {
    ...mapState(["editIcon", "deleteIcon", "detailsIcon"]),
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Sucursal" : "Editar Sucursal";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.sucursales = [
        {
          id: 30,
          name: "Ninna y tato (Principal)",
          address: "Calle 48 cc #120E 113 san javier la loma",
          phone: "2528099",
          state: true,
        },
        {
          id: 32,
          name: "Ninna y tato (Principal)",
          address: "Calle 48 cc #120E 113 san javier la loma",
          phone: "2528099",
          state: false,
        },
        {
          id: 33,
          name: "Ninna y tato (Principal)",
          address: "Calle 48 cc #120E 113 san javier la loma",
          phone: "2528099",
          state: true,
        },
        {
          id: 34,
          name: "Ninna y tato (Principal)",
          address: "Calle 48 cc #120E 113 san javier la loma",
          phone: "2528099",
          state: false,
        },
        {
          id: 36,
          name: "Ninna y tato (Principal)",
          address: "Calle 48 cc #120E 113 san javier la loma",
          phone: "2528099",
          state: false,
        },
      ];
    },

    changeStateSucursal(item) {
      // Cambiar el estado de la sucursal
      this.editedIndex = this.sucursales.indexOf(item);
      // let itemObject = Object.assign({}, item); // Convertir a un objeto json
      console.log(item);
    },

    editItem(item) {
      this.editedIndex = this.sucursales.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.sucursales.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.sucursales.splice(index, 1);
    },

    goToShowDetailSucursal(item) {
      // Ir a monstrar los detalles de esta sucursal (Caja, stocks, trabajadores, clientes registrados en esa sucursal, mascotas en esa sucursal, sus habitaciones, etc)
      this.editedIndex = this.sucursales.indexOf(item);
      // let itemObject = Object.assign({}, item); // Convertir a un objeto json
      console.log(item);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        // Update
        Object.assign(this.sucursales[this.editedIndex], this.editedItem);
      } else {
        // Create
        this.sucursales.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
