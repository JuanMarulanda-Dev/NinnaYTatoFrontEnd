<template>
  <v-data-table
    fixed-header
    :headers="headers"
    :items="reservations"
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
          <v-icon large>mdi-book</v-icon> Reservaciones
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <!-- Modal New/edit-->
        <v-dialog v-model="dialog" persistent max-width="500px">
          <!-- Modal Form -->
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="secondary"
              elevation="3"
              dark
              v-bind="attrs"
              v-on="on"
              v-show="permissions.create"
            >
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>
          </template>
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
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Nombre*"
                      required
                      prepend-inner-icon="mdi-format-letter-matches"
                      counter="255"
                      :error-messages="nameErrors"
                      @input="$v.editedItem.name.$touch()"
                      @blur="$v.editedItem.name.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.address"
                      label="Dirrección*"
                      prepend-inner-icon="mdi-map-marker"
                      counter="255"
                      :error-messages="addressErrors"
                      @input="$v.editedItem.address.$touch()"
                      @blur="$v.editedItem.address.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.phone"
                      label="Telefono*"
                      prepend-inner-icon="mdi-phone"
                      counter="255"
                      :error-messages="phoneErrors"
                      @input="$v.editedItem.phone.$touch()"
                      @blur="$v.editedItem.phone.$touch()"
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
            v-show="permissions.update"
          >
            <v-icon> {{ editIcon }} </v-icon>
          </v-btn>
        </template>
        <span>Editar</span>
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
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data: () => ({
    permissions: {},
    dialog: false,
    headers: [
      {
        text: "Nombre",
        align: "start",
        value: "name",
      },
      { text: "Habitacion", value: "room_name" },
      { text: "Fecha inicio", value: "start" },
      { text: "Fecha fin", value: "end" },
      { text: "Creado", value: "created_at" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
  }),

  computed: {
    ...mapState(["editIcon", "deleteIcon", "detailsIcon", "loadingText"]),
    ...mapState("reservations", [
      "reservations",
      "loading",
      "editedItem",
      "defaultItem",
    ]),
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Reserva" : "Editar Reserva";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
      this.$v.$reset();
    },
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
    ...mapActions("reservations", [
      "getAllReservations",
      "storeReservation",
      "updateReservation",
      "destroyReservation",
    ]),
    ...mapMutations("reservations", ["SET_EDIT_ITEM"]),
    initialize() {
      if (this.reservations.length == 0) {
        this.getAllReservations();
      }
    },

    editItem(item) {
      this.editedIndex = this.reservations.indexOf(item);
      this.SET_EDIT_ITEM(Object.assign({}, item));
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.SET_EDIT_ITEM(Object.assign({}, this.defaultItem));
        this.editedIndex = -1;
      });
    },

    save() {
      // activate validations form
      this.$v.$touch();
      // Correct validations
      if (!this.$v.$invalid) {
        if (this.editedIndex > -1) {
          // Do update
          this.updateReservation().then((result) => {
            if (result) {
              this.close();
            }
          });
        } else {
          // Do store
          this.storeReservation().then((result) => {
            if (result) {
              this.close();
            }
          });
        }
      }
    },

    destroyReservation(item) {
      // Confirmation to change de status
      this.$confirm("¿Quieres esta reservación?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Make to change status to backend
          this.destroyReservation(item.id);
        }
      });
    },
  },
};
</script>
