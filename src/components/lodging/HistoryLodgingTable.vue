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
          <lodging-data-table
            v-model="lodgings_history"
            :headers="headers"
            :search="search"
          >
            <!-- Datatable history lodging-->
            <template v-slot:header>
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
          </lodging-data-table>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import LodgingDataTable from "@/components/lodging/LodgingDataTable.vue";

export default {
  name: "history-lodging-table",
  data() {
    return {
      editedIndex: -1,
      startDate: "",
      search: "",
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
    ...mapState(["user"]),
    ...mapState("lodging", ["lodgings_history"]),
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
  },
  components: {
    LodgingDataTable,
  },
};
</script>
