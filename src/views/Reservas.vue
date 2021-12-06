<template>
  <div>
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
            :return-value.sync="startDate"
            persistent
            width="290px"
            :retain-focus="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="mt-8"
                v-model="startDate"
                label="Fecha"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              @change="getAllReservations()"
              v-model="startDate"
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialogStart = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.start.save(startDate)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
          <!-- Filter date end -->
          <v-dialog
            ref="end"
            v-model="dialogEnd"
            :return-value.sync="endDate"
            persistent
            width="290px"
            :retain-focus="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="mt-8"
                v-model="endDate"
                label="Fecha"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              @change="getAllReservations()"
              v-model="endDate"
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialogEnd = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.end.save(endDate)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
          <v-spacer></v-spacer>
          <!-- search field -->
          <v-text-field
            v-model="search"
            class="mr-3"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
          <v-btn
            fab
            small
            color="secondary"
            elevation="3"
            dark
            v-show="permissions.create"
            @click="SET_DIALOG_FORM(true)"
          >
            <v-icon>mdi-plus-thick</v-icon>
          </v-btn>
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

    <dialog-reservation-form v-model="editedIndex"> </dialog-reservation-form>
  </div>
</template>

<script>
import moment from "moment";
import DialogReservationForm from "@/components/reservations/DialogReservationForm.vue";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data: () => ({
    status_form: false,
    permissions: {},
    dialogStart: false,
    dialogEnd: false,
    search: "",
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
      "start",
      "end",
      "reservations",
      "loading",
      "defaultItem",
      "editedItem",
    ]),
    startDate: {
      get: function () {
        return this.start;
      },
      set: function (newValue) {
        this.SET_START_DATE(newValue);
      },
    },
    endDate: {
      get: function () {
        return this.end;
      },
      set: function (newValue) {
        this.SET_END_DATE(newValue);
      },
    },
  },

  created() {
    this.SET_START_DATE(
      moment(Date.now()).subtract(2, "months").format("YYYY-MM-DD")
    );
    this.SET_END_DATE(moment(Date.now()).add(2, "months").format("YYYY-MM-DD"));
    // Obtener los permisos
    this.permissions = this.$route.meta.permissions;
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
    ...mapActions("reservations", [
      "getAllReservations",
      "getAllRoomsReservationsBetweenDates",
      "getAllCustomersPets",
      "storeReservation",
      "updateReservation",
      "destroyReservation",
    ]),
    ...mapMutations("reservations", [
      "SET_EDIT_ITEM",
      "SET_START_DATE",
      "SET_END_DATE",
      "SET_DIALOG_FORM",
    ]),
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
      //
      this.SET_DIALOG_FORM(true);
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
    DialogReservationForm,
  },
};
</script>
