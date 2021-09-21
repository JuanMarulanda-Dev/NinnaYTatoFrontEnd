<template>
  <div>
    <v-dialog
      v-model="dialog"
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
          <v-btn icon dark @click="SET_DIALOG_SALES_HITORY(false)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <!-- Datatable planes-->
            <v-data-table
              fixed-header
              :headers="headers"
              :items="sales"
              sort-by="name"
              class="elevation-3"
              :loading="loading"
              :loading-text="loadingText"
            >
              <!-- Header content datatable -->
              <template v-slot:top>
                <v-toolbar flat color="white" class="rounded-xl">
                  <!-- Title Module -->
                  <v-toolbar-title> </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <!-- Modal New/edit-->
                  <!-- Filter date -->
                  <v-dialog
                    ref="fecha"
                    v-model="dialogDate"
                    :return-value.sync="dateSales"
                    persistent
                    width="290px"
                    :retain-focus="false"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        class="mt-8 mr-3"
                        v-model="dateSales"
                        label="Fecha"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :max="maxDate"
                      v-model="dateSales"
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="dialogDate = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.fecha.save(dateSales)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-toolbar>
              </template>

              <!-- total -->
              <template v-slot:[`item.total`]="{ item }">
                <v-icon small>{{ moneyIcon }}</v-icon>
                {{ currencyFormat(item.total) }}
              </template>

              <!-- payment -->
              <template v-slot:[`item.payment`]="{ item }">
                <v-icon
                  small
                  :class="{ 'success--text': item.payment === item.total }"
                  >{{ moneyIcon }}</v-icon
                >
                <span :class="{ 'success--text': item.payment === item.total }">
                  {{ currencyFormat(item.payment) }}
                </span>
              </template>

              <!-- pending -->
              <template v-slot:[`item.pending`]="{ item }">
                <v-icon small :class="{ 'error--text': item.pending !== 0 }">{{
                  moneyIcon
                }}</v-icon>
                <span :class="{ 'error--text': item.pending !== 0 }">
                  {{ currencyFormat(item.pending) }}
                </span>
              </template>

              <!-- State -->
              <template v-slot:[`item.state`]="{ item }">
                <v-switch
                  :input-value="item.state"
                  v-model="item.state"
                  v-show="permissions.delete"
                  @change="changeStateSale(item)"
                ></v-switch>
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
                      @click="searchDetails(item.id, item.number_payment_proof)"
                    >
                      <v-icon>{{ detailsIcon }}</v-icon>
                    </v-btn>
                  </template>
                  <span>Detalle de venta</span>
                </v-tooltip>
                <!-- Payments -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      fab
                      x-small
                      dark
                      color="success mr-1"
                      v-bind="attrs"
                      v-on="on"
                      @click="
                        searchPayments(item.id, item.number_payment_proof)
                      "
                      v-show="item.pending > 0"
                    >
                      <v-icon>mdi-cash-multiple</v-icon>
                    </v-btn>
                  </template>
                  <span>Pagos</span>
                </v-tooltip>
                <!-- Print Paymentproof -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      fab
                      x-small
                      dark
                      color="primary mr-1"
                      v-bind="attrs"
                      v-on="on"
                      @click="
                        downloadPaymentProof({
                          saleId: item.id,
                          name: item.number_payment_proof,
                        })
                      "
                    >
                      <v-icon>mdi-printer</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Comprobante</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Show dialog payments -->
    <sale-payments :payment_proof="payment_proof"></sale-payments>
    <!-- Show dialog details -->
    <sale-details :payment_proof="payment_proof"></sale-details>
  </div>
</template>

<script>
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { mapState, mapMutations, mapActions } from "vuex";
import SalePayments from "@/components/sales/SalePayments.vue";
import SaleDetails from "@/components/sales/SaleDetails.vue";

export default {
  name: "sales-data-table",
  data: () => ({
    time: "",
    dialogDate: false,
    payment_proof: 0,
    headers: [
      { text: "N°", value: "number_payment_proof", align: "center" },
      { text: "Cliente", value: "customer_name", align: "center" },
      { text: "Total", value: "total" },
      { text: "Pagado", value: "payment" },
      { text: "Saldo pendiente", value: "pending" },
      { text: "Usuario", value: "user_name" },
      { text: "Estado", value: "state" },
      { text: "Fecha", value: "created_at" },
      { text: "Eliminado", value: "deleted_at" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
  }),
  mixins: [moneyFormatMixin],
  computed: {
    ...mapState(["loadingText", "mainBranchOffice", "detailsIcon"]),
    ...mapState("sales", ["sales", "loading", "dialog", "permissions"]),
    dateSales: {
      get() {
        return this.$store.state.sales.dateSales;
      },
      set(value) {
        this.$store.commit("sales/SET_DATESALES", value);
      },
    },
    maxDate() {
      return this.getNowDate();
    },
  },

  watch: {
    dialog(value) {
      if (value) {
        this.getAllSales();
      }
    },
    dateSales() {
      this.getAllSales();
    },
  },

  methods: {
    ...mapMutations("sales", ["SET_DIALOG_SALES_HITORY"]),
    ...mapActions("sales", [
      "getAllSales",
      "changeStatusSale",
      "getSalePayments",
      "downloadPaymentProof",
      "getSaleDetails",
    ]),

    searchPayments(saleId, payment_proof) {
      this.payment_proof = payment_proof;
      this.getSalePayments(saleId);
    },

    searchDetails(saleId, payment_proof) {
      this.payment_proof = payment_proof;
      this.getSaleDetails(saleId);
    },

    changeStateSale(item) {
      // Confirmation to change de status
      this.$confirm("¿Quieres cambiar el estado de esta venta?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Make to change status to backend
          this.changeStatusSale(item.id).then((result) => {
            if (!result) {
              // Rollback the state from branch office
              this.rollbackStateSale(item);
            }
          });
        } else {
          // Rollback the state from branch office
          this.rollbackStateSale(item);
        }
      });
    },

    rollbackStateSale(item) {
      let saleIndex = this.sales.indexOf(item);
      this.sales[saleIndex].state = !this.sales[saleIndex].state;
    },
  },
  components: {
    SalePayments,
    SaleDetails,
  },
};
</script>
