<template>
  <div>
    <v-data-table
      fixed-header
      :headers="headers"
      :items="lodgings"
      sort-by="name"
      class="elevation-3"
      :search="search"
      :loading="loading"
      :loading-text="loadingText"
    >
      <!-- Header content datatable -->
      <template v-slot:top>
        <v-toolbar flat color="white" class="rounded-xl">
          <!-- Title Module -->
          <v-toolbar-title>
            <v-icon large>mdi-home-heart</v-icon> Ingresos y salidas
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
          <!-- Modal New entry-->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mx-3"
                fab
                small
                dark
                color="secondary"
                v-bind="attrs"
                v-on="on"
                @click="dialogHistoryLodgingTable = true"
              >
                <v-icon>mdi-book-search</v-icon>
              </v-btn>
            </template>
            <span>Consultar Ingresos</span>
          </v-tooltip>

          <!-- Plus Entry -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                small
                dark
                color="info mr-1"
                v-bind="attrs"
                v-on="on"
                @click="dialogEntry = true"
                v-show="permissions.create"
              >
                <v-icon>mdi-plus-thick</v-icon>
              </v-btn>
            </template>
            <span>Agregar ingreso</span>
          </v-tooltip>
        </v-toolbar>
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
              @click="
                showPetDetails(item.customer_id, item.arrival_data.pet_id)
              "
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
              @click="showMonitoringForm(item.name, item.id, item.pet_avatar)"
            >
              <v-icon>mdi-timeline</v-icon>
            </v-btn>
          </template>
          <span>Seguimiento</span>
        </v-tooltip>

        <!-- Edit in-->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              dark
              color="secondary mr-1"
              v-bind="attrs"
              v-on="on"
              @click="showEditEntryForm(item.arrival_data, item.id)"
              v-show="permissions.update"
            >
              <v-icon> {{ editIcon }} </v-icon>
            </v-btn>
          </template>
          <span>Editar ingreso</span>
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
              @click="
                showOutputForm(
                  item.id,
                  item.customer_id,
                  item.arrival_no_format,
                  item.name
                )
              "
              v-show="permissions.create"
            >
              <v-icon> mdi-home-import-outline </v-icon>
            </v-btn>
          </template>
          <span>Salir</span>
        </v-tooltip>

        <!-- Delete In -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              dark
              color="error mr-1"
              v-bind="attrs"
              v-on="on"
              @click="deleteItem(item.id, item.name)"
              v-show="permissions.delete"
            >
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </template>
          <span>Eliminar</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <entry-form :lodging_id="lodging_id" v-model="dialogEntry"></entry-form>

    <output-form
      v-model="dialogOutput"
      :lodging_id="lodging_id"
      :arrival_date="arrival_date"
      :pet_name="pet_name"
      :is_close="is_close"
    ></output-form>

    <monitoring-form
      v-model="dialogMonitoring"
      :pet_name="pet_name"
      :pet_avatar="pet_avatar"
      :lodging_id="lodging_id"
      :add_monitoring="add_monitoring"
    ></monitoring-form>

    <history-lodging-table
      @showMonitoring="
        showMonitoringForm($event.name, $event.id, $event.pet_avatar, false)
      "
      @showPetDetails="showPetDetails($event.customer_id, $event.pet_id)"
      @showOutputForm="
        showOutputForm(
          $event.id,
          $event.customer_id,
          $event.arrival_no_format,
          $event.name,
          $event.departure_data,
          $event.departure_data.date ? true : false
        )
      "
      v-model="dialogHistoryLodgingTable"
    >
    </history-lodging-table>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import EntryForm from "@/components/lodging/EntryForm.vue";
import OutputForm from "@/components/lodging/OutputForm.vue";
import MonitoringForm from "@/components/lodging/MonitoringForm.vue";
import HistoryLodgingTable from "@/components/lodging/HistoryLodgingTable.vue";

export default {
  data: () => ({
    permissions: {},
    dialogPetDetails: false,
    dialogEntry: false,
    dialogOutput: false,
    dialogMonitoring: false,
    dialogHistoryLodgingTable: false,
    pet_name: "",
    add_monitoring: false,
    is_close: false,
    pet_avatar: "",
    pet_id: "",
    lodging_id: "",
    arrival_date: "",
    search: "",
    headers: [
      {
        text: "Nombre mascota",
        align: "start",
        value: "name",
      },
      { text: "Desayuno", align: "center", value: "breakfast" },
      { text: "Almuerzo", align: "center", value: "lunch" },
      { text: "Cena", align: "center", value: "dinner" },
      { text: "Ingreso", align: "center", value: "arrival_date" },
      { text: "Salida", align: "center", value: "departure_date" },
      { text: "Acciones", align: "center", value: "actions", sortable: false },
    ],
    entry_pet_details: {},
  }),
  computed: {
    ...mapState(["editIcon", "loadingText", "mainBranchOffice"]),
    ...mapState("lodging", ["lodgings", "loading"]),
    ...mapState("customers", ["personal_infomation"]),
  },
  watch: {
    dialog(val) {
      val || this.close();
      this.$v.$reset();
    },
    dialogEntry(newValue) {
      if (!newValue) {
        this.lodging_id = "";
      }
    },
    dialogOutput(newValue) {
      if (!newValue) {
        this.SET_DEFAULT_DATA_OUTPUT();
        this.lodging_id = "";
      }
    },
    dialogMonitoring(newValue) {
      if (!newValue) {
        this.lodging_id = "";
      }
    },
    dialogHistoryLodgingTable(newValue) {
      if (!newValue) {
        this.lodging_id = "";
      }
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

    this.getAllDefaultPlans();
    this.getAllCashRegisters(1);

    // Acciones que debe realizar el componente una vez creado
    if (this.permissions.read) {
      this.initialize();
    }
  },
  methods: {
    ...mapActions("lodging", [
      "getAllLodging",
      "getAllAccessories",
      "getAllCustomersPets",
      "getAllDefaultPlans",
      "deleteEntry",
    ]),
    ...mapActions("monitorings", [
      "getMonitoryByPetLodging",
      "getAllMonitoringTypes",
    ]),
    ...mapActions("customers", ["getAllCustomersPlans"]),
    ...mapActions("cash_registers", ["getAllCashRegisters"]),
    ...mapMutations("lodging", [
      "SET_ENTRY_DATA",
      "SET_DEFAULT_DATA_OUTPUT",
      "SET_OUTPUT_DATA",
    ]),
    initialize() {
      this.getAllLodging({ status: 1 });
      this.getAllAccessories();
      this.getAllCustomersPets();
      this.getAllMonitoringTypes();
    },

    showPetDetails(customer_id, pet_id) {
      // Consultar el detalle de la mascota
      this.personal_infomation.id = customer_id;
      this.$router.push({
        path: `/clientes/detalles/${customer_id}/mascota/${pet_id}`,
      });
    },

    showOutputForm(
      lodging_id,
      customer_id,
      arrival_date,
      pet_name,
      output_data = {},
      is_close = false
    ) {
      this.getAllCustomersPlans(customer_id);
      if (!this.isObjEmpty(output_data)) {
        this.SET_OUTPUT_DATA(output_data);
      }
      this.lodging_id = lodging_id;
      this.arrival_date = arrival_date;
      this.pet_name = pet_name;
      this.is_close = is_close;
      this.dialogOutput = true;
    },
    isObjEmpty(obj) {
      return Object.keys(obj).length === 0;
    },
    showMonitoringForm(
      pet_name,
      lodging_id,
      pet_avatar = null,
      add_monitoring = true
    ) {
      this.pet_name = pet_name;
      this.pet_avatar = pet_avatar;
      this.lodging_id = lodging_id;
      this.add_monitoring = add_monitoring;
      this.getMonitoryByPetLodging(lodging_id).then((result) => {
        if (result) {
          // search follow up by the last lodging by pet
          this.dialogMonitoring = true;
        }
      });
    },

    showEditEntryForm(item, lodging_id) {
      this.SET_ENTRY_DATA(item);
      this.lodging_id = lodging_id;
      this.dialogEntry = true;
    },

    deleteItem(id, name) {
      this.$confirm(`¿Seguro quieres eliminar este ingreso de ${name}?`, {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          this.deleteEntry(id);
        }
      });
    },
  },

  components: {
    EntryForm,
    OutputForm,
    MonitoringForm,
    HistoryLodgingTable,
  },
};
</script>
