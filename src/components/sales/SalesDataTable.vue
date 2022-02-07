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

              <!-- total -->
              <template v-slot:[`item.total`]="{ item }">
                <v-icon small>{{ moneyIcon }}</v-icon>
                {{ currencyFormat(item.total) }}
              </template>

              <!-- payment -->
              <template v-slot:[`item.payment`]="{ item }">
                <v-icon
                  small
                  :class="{
                    'success--text':
                      item.payment === item.total && item.total > 0,
                  }"
                  >{{ moneyIcon }}</v-icon
                >
                <span
                  :class="{
                    'success--text':
                      item.payment === item.total && item.total > 0,
                  }"
                >
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
                        searchPayments(
                          item.id,
                          item.number_payment_proof,
                          item.note
                        )
                      "
                      v-show="item.pending > 0 || user.is_admin"
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
                <!-- Note -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      fab
                      x-small
                      dark
                      color="secondary"
                      v-bind="attrs"
                      v-on="on"
                      @click="
                        showNoteFormDialog(
                          item.id,
                          item.number_payment_proof,
                          item.note
                        )
                      "
                    >
                      <v-icon>mdi-note-text</v-icon>
                    </v-btn>
                  </template>
                  <span>Nota</span>
                </v-tooltip>
              </template>

              <template v-slot:[`body.append`]="{ items }">
                <tr>
                  <td class="font-weight-bold"></td>
                  <td class="text-center font-weight-bold">Totals</td>
                  <td class="text-left font-weight-bold">
                    <v-icon small>
                      {{ moneyIcon }}
                    </v-icon>
                    {{ currencyFormat(totals(items).total) }}
                  </td>
                  <td class="text-left font-weight-bold">
                    <v-icon small>
                      {{ moneyIcon }}
                    </v-icon>
                    {{ currencyFormat(totals(items).payment) }}
                  </td>
                  <td class="text-left font-weight-bold">
                    <v-icon small>
                      {{ moneyIcon }}
                    </v-icon>
                    {{ currencyFormat(totals(items).pending) }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Show dialog payments -->
    <sale-payments :payment_proof="payment_proof" :note="note"></sale-payments>
    <!-- Show dialog details -->
    <sale-details :payment_proof="payment_proof"></sale-details>
    <!-- Show dialog note -->
    <note-form-dialog
      v-model="dialogNoteForm"
      :id="id_sale"
      :type="note_type"
      :note="note"
      :title="title"
      @saved="updateRowNote($event)"
    ></note-form-dialog>
  </div>
</template>

<script>
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { mapState, mapMutations, mapActions } from "vuex";
import SalePayments from "@/components/sales/SalePayments.vue";
import SaleDetails from "@/components/sales/SaleDetails.vue";
import NoteFormDialog from "@/components/NoteFormDialog.vue";
import moment from "moment";

export default {
  name: "sales-data-table",
  data: () => ({
    time: "",
    dialogDate: false,
    dialogNoteForm: false,
    payment_proof: 0,
    title: "",
    note_type: 1,
    id_sale: "",
    note: "",
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
      { text: "Nota", value: "note", width: "16%" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
  }),
  mixins: [moneyFormatMixin],
  created() {
    this.SET_START_DATE(moment().startOf("month").format("YYYY-MM-DD"));
    this.SET_END_DATE(moment().endOf("month").format("YYYY-MM-DD"));
  },
  computed: {
    ...mapState(["loadingText", "mainBranchOffice", "detailsIcon", "user"]),
    ...mapState("sales", [
      "sales",
      "loading",
      "dialog",
      "permissions",
      "start",
      "end",
    ]),
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
    ...mapActions("sales", [
      "getAllSales",
      "changeStatusSale",
      "getSalePayments",
      "downloadPaymentProof",
      "getSaleDetails",
    ]),

    searchPayments(saleId, payment_proof, note) {
      this.payment_proof = payment_proof;
      this.note = note ?? "";
      this.getSalePayments(saleId);
    },

    searchDetails(saleId, payment_proof) {
      this.payment_proof = payment_proof;
      this.getSaleDetails(saleId);
    },

    showNoteFormDialog(id, payment_proof, note) {
      this.id_sale = id;
      this.title = "Venta N° " + payment_proof;
      this.note = note ?? "";
      this.dialogNoteForm = true;
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

    updateRowNote(note) {
      let row = this.sales.find((element) => element.id === this.id_sale);
      row.note = note;
    },

    totals(items) {
      const totals = items.reduce(
        (acc, d) => {
          if (d.state) {
            acc.payment += parseFloat(d.payment);
            acc.pending += parseFloat(d.pending);
            acc.total += parseFloat(d.total);
          }

          return acc;
        },
        {
          payment: 0,
          pending: 0,
          total: 0,
        }
      );
      return totals;
    },
  },
  components: {
    SalePayments,
    SaleDetails,
    NoteFormDialog,
  },
};
</script>
