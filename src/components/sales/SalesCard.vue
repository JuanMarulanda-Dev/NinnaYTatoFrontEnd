<template>
  <div>
    <v-dialog
      v-model="dialogSaleDataTable"
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
              <v-icon large>mdi-cart</v-icon>
              Historial de ventas
            </span></v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialogSaleDataTable = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
            <!-- Datatable planes-->
            <sales-data-table
              v-model="sales"
              :headers="headersSales"
              @rollback="rollbackStateSale($event)"
            >
              <template v-slot:header>
                <v-toolbar flat color="white" class="rounded-xl">
                  <!-- Title Module -->
                  <v-toolbar-title> </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <!-- Start date -->
                  <v-dialog
                    ref="start"
                    v-model="dialogDate"
                    :return-value.sync="startDate"
                    persistent
                    width="290px"
                    :retain-focus="false"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        class="mt-8 mr-3"
                        v-model="startDate"
                        label="Desde"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :max="maxDate"
                      v-model="startDate"
                      scrollable
                      @change="getAllSales()"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="dialogDate = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.start.save(startDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                  <!-- End date -->
                  <v-dialog
                    ref="end"
                    v-model="dialogDate"
                    :return-value.sync="endDate"
                    persistent
                    width="290px"
                    :retain-focus="false"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        class="mt-8 mr-3"
                        v-model="endDate"
                        label="Hasta"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :max="maxDate"
                      v-model="endDate"
                      scrollable
                      @change="getAllSales()"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="dialogDate = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.end.save(endDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-toolbar>
              </template>
            </sales-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import SalesDataTable from "@/components/sales/SalesDataTable.vue";
import moment from "moment";

export default {
  name: "sales-card",
  data: () => ({
    dialogDate: false,
  }),
  created() {
    this.SET_START_DATE(moment().startOf("month").format("YYYY-MM-DD"));
    this.SET_END_DATE(moment().endOf("month").format("YYYY-MM-DD"));
  },
  computed: {
    ...mapState(["loadingText", "mainBranchOffice", "detailsIcon", "user"]),
    ...mapState("sales", ["sales", "dialog", "start", "end", "headersSales"]),
    dialogSaleDataTable: {
      get() {
        return this.dialog;
      },
      set(value) {
        this.SET_DIALOG_SALES_HITORY(value);
      },
    },

    maxDate() {
      return this.getNowDate();
    },

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

  watch: {
    dialog(value) {
      if (value) {
        this.getAllSales();
      }
    },
  },

  methods: {
    ...mapMutations("sales", [
      "SET_DIALOG_SALES_HITORY",
      "SET_START_DATE",
      "SET_END_DATE",
    ]),
    ...mapActions("sales", ["getAllSales", "changeStatusSale"]),

    rollbackStateSale(saleIndex) {
      this.sales[saleIndex].state = !this.sales[saleIndex].state;
    },
  },
  components: {
    SalesDataTable,
  },
};
</script>
