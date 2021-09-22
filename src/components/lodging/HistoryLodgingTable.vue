<template>
  <v-dialog
    v-model="dialogHistoryLodging"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
  >
    <!-- Modal Form -->
    <v-card tile color="background">
      <v-toolbar flat dark color="secondary" max-height="10vh">
        <v-toolbar-title
          ><span class="headline">
            <v-icon large>mdi-home-heart</v-icon>
            Historial de ingresos y de salidas
          </span></v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialogHistoryLodging = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <!-- Datatable history lodging-->
          <v-data-table
            fixed-header
            :headers="headers"
            :items="lodgings_history"
            sort-by="name"
            class="elevation-3"
            :search="search"
            :loading="loading"
            :loading-text="loadingText"
          >
            <!-- Header content datatable -->
            <template v-slot:top>
              <v-toolbar flat color="white" class="rounded-xl">
                <!-- Start date -->
                <v-dialog
                  ref="dialog"
                  v-model="modalStartDatePicker"
                  :return-value.sync="startDate"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="startDate"
                      label="Fecha de llegada"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      hide-details
                      class="mr-2"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="startDate" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="modalStartDatePicker = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog.save(startDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <!-- search filed -->
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-toolbar>
            </template>

            <!-- Avatar + nombre -->
            <template v-slot:[`item.name`]="{ item }">
              <!-- Image profile -->
              <v-tooltip right v-if="item.pet_avatar">
                <template v-slot:activator="{ on, attrs }">
                  <v-avatar v-bind="attrs" v-on="on" class="my-2 mr-1">
                    <img :src="item.pet_avatar" :alt="item.name" />
                  </v-avatar>
                </template>
                <span>
                  <v-avatar size="200">
                    <img :src="item.pet_avatar" :alt="item.name" />
                  </v-avatar>
                </span>
              </v-tooltip>

              <!-- Icon profile -->
              <v-avatar v-else color="grey lighten-1" class="my-2 mr-1">
                <v-icon dark> mdi-dog-side </v-icon>
              </v-avatar>
              <span>
                {{ item.name }}
              </span>
            </template>

            <!-- Actions -->
            <template v-slot:[`item.actions`]="{ item }">
              <!-- Details -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab
                    x-small
                    dark
                    color="info mr-1"
                    v-bind="attrs"
                    v-on="on"
                    @click="showPetDetails(item)"
                  >
                    <v-icon> mdi-paw</v-icon>
                  </v-btn>
                </template>
                <span>Detalles Mascotas</span>
              </v-tooltip>

              <!-- Timelines -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab
                    x-small
                    dark
                    color="warning mr-1"
                    v-bind="attrs"
                    v-on="on"
                    @click="showMonitoring(item)"
                  >
                    <v-icon>mdi-timeline</v-icon>
                  </v-btn>
                </template>
                <span>Seguimiento</span>
              </v-tooltip>

              <!-- Out -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab
                    x-small
                    dark
                    color="accent mr-1"
                    v-bind="attrs"
                    v-on="on"
                    v-show="user.is_admin"
                    @click="showOutputForm(item)"
                  >
                    <v-icon> mdi-home-import-outline </v-icon>
                  </v-btn>
                </template>
                <span>Editar salida</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "history-lodging-table",
  data() {
    return {
      editedIndex: -1,
      search: "",
      startDate: "",
      modalStartDatePicker: false,
      headers: [
        {
          text: "Nombre mascota",
          align: "start",
          value: "name",
        },
        { text: "Ingreso", align: "center", value: "arrival_date" },
        { text: "Salida", align: "center", value: "departure_date" },
        { text: "Horas", align: "center", value: "departure_data.hours" },
        {
          text: "Nombre del plan",
          align: "center",
          value: "departure_data.plan_name",
        },
        {
          text: "Acciones",
          align: "center",
          value: "actions",
          sortable: false,
        },
      ],
    };
  },
  model: { prop: "value", event: "input" },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState(["user", "loadingText", "editIcon"]),
    ...mapState("lodging", ["lodgings_history", "loading"]),
    dialogHistoryLodging: {
      get: function () {
        return this.value;
      },
      set: function (newValue) {
        this.$emit("input", newValue);
      },
    },
  },
  watch: {
    startDate(newValue) {
      if (newValue !== "") {
        this.$emit("date", this.startDate);
        this.searchLodgingHistory();
      }
    },
  },
  methods: {
    ...mapActions("lodging", ["getAllLodging"]),
    searchLodgingHistory() {
      this.getAllLodging({
        status: 0,
        date: this.startDate,
      });
    },
    showMonitoring(item) {
      this.$emit("showMonitoring", item);
    },
    showPetDetails(item) {
      this.$emit("showPetDetails", item);
    },
    showOutputForm(item) {
      this.$emit("showOutputForm", item);
    },
  },
};
</script>
