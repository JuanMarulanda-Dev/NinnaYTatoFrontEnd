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
          <h2>{{ quantityLodgings }}</h2>
          <v-divider class="mx-4" inset vertical></v-divider>

          <!-- Incomes Total Daily -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <h2 v-bind="attrs" v-on="on">
                <v-icon>{{ moneyIcon }}</v-icon>
                {{ currencyFormat(incomes_total_daily) }}
              </h2>
            </template>
            <span>Ingresos totales diarios</span>
          </v-tooltip>

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

      <!-- walks -->
      <template v-slot:[`item.arrival_data.walk`]="{ item }">
        <v-icon :color="item.arrival_data.walk ? 'success' : 'error'">
          mdi-circle-slice-8</v-icon
        >
      </template>

      <!-- prizes -->
      <template v-slot:[`item.arrival_data.prize`]="{ item }">
        <v-icon :color="item.arrival_data.prize ? 'success' : 'error'">
          mdi-circle-slice-8
        </v-icon>
      </template>

      <!-- breakfast -->
      <template v-slot:[`item.arrival_data.breakfast`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-on="on"
              v-bind="attrs"
              :color="
                item.breakfast.color
                  ? item.breakfast.color
                  : defaultColorChecks(item, 'breakfast')
              "
            >
              mdi-{{
                item.arrival_data.breakfast ? "check-circle" : "close-circle"
              }}
            </v-icon>
          </template>
          <span>{{ item.breakfast.option_name }}</span>
        </v-tooltip>
      </template>

      <!-- lunch -->
      <template v-slot:[`item.arrival_data.lunch`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-on="on"
              v-bind="attrs"
              :color="
                item.lunch.color
                  ? item.breakfast.color
                  : defaultColorChecks(item, 'lunch')
              "
            >
              mdi-{{
                item.arrival_data.lunch ? "check-circle" : "close-circle"
              }}
            </v-icon>
          </template>
          <span>{{ item.lunch.option_name }}</span>
        </v-tooltip>
      </template>

      <!-- dinner -->
      <template v-slot:[`item.arrival_data.dinner`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-on="on"
              v-bind="attrs"
              :color="
                item.dinner.color
                  ? item.breakfast.color
                  : defaultColorChecks(item, 'dinner')
              "
            >
              mdi-{{
                item.arrival_data.dinner ? "check-circle" : "close-circle"
              }}
            </v-icon>
          </template>
          <span>{{ item.dinner.option_name }}</span>
        </v-tooltip>
      </template>

      <!-- Actions -->
      <template v-slot:[`item.actions`]="{ item }">
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
              @click="
                showMonitoringForm(
                  item.name,
                  item.id,
                  item.pet_avatar,
                  item.arrival_data.day_instructions
                )
              "
            >
              <v-icon>mdi-timeline</v-icon>
            </v-btn>
          </template>
          <span>Seguimiento</span>
        </v-tooltip>

        <!-- Additional charge -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              dark
              color="primary mr-1"
              v-bind="attrs"
              v-on="on"
              @click="showAdditionalChargeForm(item.id, item.customer_id)"
            >
              <v-icon> mdi-ballot </v-icon>
            </v-btn>
          </template>
          <span>Costos adicionales</span>
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
                  item.name,
                  item.arrival_data.accessories
                )
              "
              v-show="permissions.create"
            >
              <v-icon> mdi-home-import-outline </v-icon>
            </v-btn>
          </template>
          <span>Salir</span>
        </v-tooltip>

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
      :accessories="accessories"
      :date_search="date"
    ></output-form>

    <monitoring-form
      v-model="dialogMonitoring"
      :pet_name="pet_name"
      :pet_avatar="pet_avatar"
      :lodging_id="lodging_id"
      :day_instructions="day_instructions"
      :add_monitoring="add_monitoring"
    ></monitoring-form>

    <history-lodging-table
      @date="date = $event"
      v-model="dialogHistoryLodgingTable"
    >
    </history-lodging-table>

    <additional-charge-form
      v-model="dialogAdditionalCharge"
    ></additional-charge-form>

    <dialog-reservation-form> </dialog-reservation-form>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import EntryForm from "@/components/lodging/EntryForm.vue";
import OutputForm from "@/components/lodging/OutputForm.vue";
import MonitoringForm from "@/components/lodging/MonitoringForm.vue";
import HistoryLodgingTable from "@/components/lodging/HistoryLodgingTable.vue";
import AdditionalChargeForm from "@/components/lodging/AdditionalChargeForm.vue";
import DialogReservationForm from "@/components/reservations/DialogReservationForm.vue";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";

export default {
  data: () => ({
    permissions: {},
    dialogPetDetails: false,
    dialogEntry: false,
    dialogOutput: false,
    dialogMonitoring: false,
    dialogHistoryLodgingTable: false,
    dialogAdditionalCharge: false,
    pet_name: "",
    accessories: [],
    add_monitoring: false,
    is_close: false,
    pet_avatar: "",
    pet_id: "",
    lodging_id: "",
    date: "",
    day_instructions: "",
    arrival_date: "",
    search: "",
    headers: [
      {
        text: "Nombre mascota",
        align: "start",
        value: "name",
      },
      { text: "Premios", align: "center", value: "arrival_data.prize" },
      { text: "Paseos", align: "center", value: "arrival_data.walk" },
      { text: "Desayuno", align: "center", value: "arrival_data.breakfast" },
      { text: "Almuerzo", align: "center", value: "arrival_data.lunch" },
      { text: "Cena", align: "center", value: "arrival_data.dinner" },
      { text: "Ingreso", align: "center", value: "arrival_date" },
      { text: "Acciones", align: "center", value: "actions", sortable: false },
    ],
    entry_pet_details: {},
  }),
  mixins: [moneyFormatMixin],
  computed: {
    ...mapState(["editIcon", "loadingText", "mainBranchOffice"]),
    ...mapState("lodging", ["lodgings", "loading", "incomes_total_daily"]),
    ...mapState("customers", ["personal_infomation"]),
    ...mapState("alerts", ["times"]),
    quantityLodgings() {
      return this.lodgings.length;
    },
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
    this.SET_SALE_DEFAULT();
    this.getAllDefaultPlans();
    this.getAllCashRegisters(1);
    this.getPlaDetailDefaultToLiquidationHoursExtra();

    this.getAllTypes();

    if (this.times.length == 0) {
      this.DO_TIMES();
    }

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
      "getAllSaleDetailsByLodging",
      "getPlaDetailDefaultToLiquidationHoursExtra",
    ]),
    ...mapActions("monitorings", [
      "getMonitoryByPetLodging",
      "getAllMonitoringTypes",
      "getAllMonitoringOptions",
    ]),
    ...mapActions("customers", ["getAllCustomersPlans"]),
    ...mapActions("cash_registers", ["getAllCashRegisters"]),
    ...mapActions("alerts", ["getAllTypes"]),
    ...mapMutations("lodging", [
      "SET_ENTRY_DATA",
      "SET_DEFAULT_DATA_OUTPUT",
      "SET_OUTPUT_DATA",
    ]),
    ...mapMutations("sales", [
      "SET_CUSTOMER_ID",
      "SET_LODGING_ID",
      "SET_SALE_DEFAULT",
    ]),
    ...mapMutations("alerts", ["DO_TIMES"]),
    initialize() {
      this.getAllLodging({ status: 1 });
      this.getAllAccessories();
      this.getAllCustomersPets();
      this.getAllMonitoringTypes();
      this.getAllMonitoringOptions();
    },

    showPetDetails(customer_id, pet_id) {
      // Consultar el detalle de la mascota
      this.personal_infomation.id = customer_id;
      this.$router.push({
        path: `/clientes/detalles/${customer_id}/mascota/${pet_id}`,
      });
    },

    showAdditionalChargeForm(lodging_id, customer_id) {
      this.SET_LODGING_ID(lodging_id);
      this.SET_CUSTOMER_ID(customer_id);
      // Consultar los detalles de la venta si es que existen.
      this.dialogAdditionalCharge = true;
    },

    showOutputForm(
      lodging_id,
      customer_id,
      arrival_date,
      pet_name,
      accessories,
      output_data = {},
      is_close = false
    ) {
      this.getAllCustomersPlans({ id: customer_id, unitPlanDetail: true });
      this.getAllSaleDetailsByLodging(lodging_id);
      if (!this.isObjEmpty(output_data)) {
        this.SET_OUTPUT_DATA(output_data);
      }
      this.lodging_id = lodging_id;
      this.arrival_date = arrival_date;
      this.pet_name = pet_name;
      this.is_close = is_close;
      this.accessories = accessories;
      this.dialogOutput = true;
    },

    isObjEmpty(obj) {
      return Object.keys(obj).length === 0;
    },

    showMonitoringForm(
      pet_name,
      lodging_id,
      pet_avatar = null,
      day_instructions = null,
      add_monitoring = true
    ) {
      this.pet_name = pet_name;
      this.pet_avatar = pet_avatar;
      this.lodging_id = lodging_id;
      this.day_instructions = day_instructions ?? "";
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

    defaultColorChecks(item, seccion) {
      return item.arrival_data[seccion] ? "blue lighten-3" : "";
    },
  },

  components: {
    EntryForm,
    OutputForm,
    MonitoringForm,
    HistoryLodgingTable,
    AdditionalChargeForm,
    DialogReservationForm,
  },
};
</script>
