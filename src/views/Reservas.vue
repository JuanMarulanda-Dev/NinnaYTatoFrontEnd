<template>
  <v-data-table
    fixed-header
    :headers="headers"
    :items="reservations"
    sort-by="name"
    class="elevation-3"
    :loading="loading"
    :loading-text="loadingText"
    :search="search"
  >
    <!-- Header content datatable -->
    <template v-slot:top>
      <v-toolbar flat color="white" class="rounded-xl">
        <!-- Title Module -->
        <v-toolbar-title>
          <v-icon large>mdi-book</v-icon> Reservaciones
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <!-- Filter date start -->
        <v-dialog
          ref="start"
          v-model="dialogStart"
          :return-value.sync="start"
          persistent
          width="290px"
          :retain-focus="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="mt-8"
              v-model="start"
              label="Fecha"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="start" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="dialogStart = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.start.save(start)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <!-- Filter date end -->
        <v-dialog
          ref="end"
          v-model="dialogEnd"
          :return-value.sync="end"
          persistent
          width="290px"
          :retain-focus="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="mt-8"
              v-model="end"
              label="Fecha"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="end" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="dialogEnd = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.end.save(end)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          class="mr-3"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
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
                <v-icon large>mdi-book</v-icon>
                {{ formTitle }}
              </span>
            </v-card-title>

            <v-card-text>
              <reservation-form
                v-model="status_form"
                :dialog="dialog"
              ></reservation-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Modal Schedule gantt -->
        <v-btn
          fab
          small
          class="ml-1"
          color="info"
          elevation="3"
          dark
          v-show="permissions.read"
        >
          <v-icon>mdi-calendar-text-outline</v-icon>
        </v-btn>
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

      <!-- Delete-->
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            x-small
            dark
            color="error"
            v-bind="attrs"
            v-on="on"
            @click="destroy(item.id)"
          >
            <v-icon> {{ deleteIcon }} </v-icon>
          </v-btn>
        </template>
        <span>Eliminar</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import moment from "moment";
import ReservationForm from "@/components/reservations/ReservationForm.vue";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data: () => ({
    status_form: false,
    permissions: {},
    dialogStart: false,
    dialogEnd: false,
    dialog: false,
    search: "",
    start: "",
    end: "",
    headers: [
      {
        text: "Nombre",
        align: "start",
        value: "name",
      },
      { text: "Habitacion", value: "room_name" },
      { text: "Fecha inicio", value: "start" },
      { text: "Fecha fin", value: "end" },
      { text: "Actualizado", value: "updated_at" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
  }),

  computed: {
    ...mapState(["editIcon", "deleteIcon", "loadingText", "mainBranchOffice"]),
    ...mapState("reservations", [
      "reservations",
      "loading",
      "defaultItem",
      "editedItem",
    ]),
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Reserva" : "Editar Reserva";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    mainBranchOffice() {
      if (this.permissions.read) {
        this.initialize();
      }
    },
  },

  created() {
    // Obtener los permisos
    this.permissions = this.$route.meta.permissions;
    // Acciones que debe realizar el componente una vez creado
    if (this.permissions.read) {
      this.initialize();
    }
    this.start = moment(Date.now()).subtract(2, "months").format("YYYY-MM-DD");
    this.end = moment(Date.now()).add(2, "months").format("YYYY-MM-DD");
  },

  methods: {
    ...mapActions("reservations", [
      "getAllReservations",
      "getAllRoomsReservationsBetweenDates",
      "getAllCustomersPets",
      "storeReservation",
      "updateReservation",
      "destroyReservation",
    ]),
    ...mapMutations("reservations", ["SET_EDIT_ITEM"]),
    initialize() {
      this.getAllReservations();
      this.getAllCustomersPets();
    },

    editItem(item) {
      this.editedIndex = this.reservations.indexOf(item);
      this.SET_EDIT_ITEM(Object.assign({}, item));
      this.getAllRoomsReservationsBetweenDates({
        start: this.editedItem.start,
        end: this.editedItem.end,
      });
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
      // Correct validations
      if (this.status_form) {
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

    destroy(id) {
      // Confirmation to change de status
      this.$confirm("¿Quieres esta reservación?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Make to change status to backend
          this.destroyReservation(id);
        }
      });
    },
  },
  components: {
    ReservationForm,
  },
};
</script>
