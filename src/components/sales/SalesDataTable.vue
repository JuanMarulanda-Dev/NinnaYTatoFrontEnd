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
              :headers="headersSales"
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
                <sale-actions
                  :item="item"
                  :permissions="permissions"
                ></sale-actions>
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
    <sale-payments></sale-payments>
    <!-- Show dialog details -->
    <sale-details></sale-details>
    <!-- Show dialog note -->
    <note-form-dialog @saved="updateRowNote($event)"></note-form-dialog>
  </div>
</template>

<script>
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { mapState, mapMutations, mapActions } from "vuex";
import SalePayments from "@/components/sales/SalePayments.vue";
import SaleDetails from "@/components/sales/SaleDetails.vue";
import NoteFormDialog from "@/components/NoteFormDialog.vue";
import SaleActions from "@/components/sales/SaleActions.vue";
import moment from "moment";

export default {
  name: "sales-data-table",
  data: () => ({
    time: "",
    dialogDate: false,
    payment_proof: 0,
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
      "headersSales",
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
    ...mapActions("sales", ["getAllSales", "changeStatusSale"]),

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

    updateRowNote(data) {
      let row = this.sales.find((element) => element.id === data.id);
      row.note = data.note;
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
    SaleActions,
  },
};
</script>
