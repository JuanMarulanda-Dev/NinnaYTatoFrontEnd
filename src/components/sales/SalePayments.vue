<template>
  <v-dialog v-model="dialogPayments" persistent max-width="700px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon large>mdi-cash-multiple</v-icon>
          Pagos - <small>venta N° {{ payment_proof }}</small>
        </span>
        <v-spacer></v-spacer>
        <!-- Info about module -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="primary" dark v-bind="attrs" v-on="on">
              mdi-alert-circle-outline
            </v-icon>
          </template>
          <span>
            * Acá se podran registrar todos los pagos de la venta seleccionada
          </span>
        </v-tooltip>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <vuetify-money
                label="Saldo a pagar"
                v-model="payment"
              ></vuetify-money>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-data-table
                height="200"
                :headers="headers"
                :items="payments"
                fixed-header
                hide-default-footer
                class="elevation-1"
              >
                <!-- State -->
                <template v-slot:[`item.total`]="{ item }">
                  <v-icon>{{ moneyIcon }}</v-icon>
                  {{ currencyFormat(item.total) }}
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close()"> Cancel </v-btn>
        <v-btn color="blue darken-1" text @click="save()"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import VuetifyMoney from "@/components/vuetifyMoney.vue";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
export default {
  name: "sale-payments",
  data() {
    return {
      payment: 0,
      headers: [
        { text: "Monto", value: "total", align: "center" },
        { text: "Fecha", value: "created_at", align: "center" },
      ],
    };
  },
  props: {
    payment_proof: {
      type: Number,
      required: true,
    },
  },
  mixins: [moneyFormatMixin],
  computed: {
    ...mapState("sales", ["dialogPayments", "payments"]),
  },
  methods: {
    ...mapMutations("sales", ["SET_DIALOG_SALE_PAYMENTS"]),
    ...mapActions("sales", ["storeSalePayment", "getAllSales"]),
    close() {
      this.SET_DIALOG_SALE_PAYMENTS(false);
    },
    save() {
      this.$confirm("¿Estas seguro que quieres registrar este pago?", {
        title: "Advertencia",
      }).then((result) => {
        if (result) {
          // Store
          if (this.payment > 0) {
            this.storeSalePayment(this.payment).then((result) => {
              if (result) {
                this.getAllSales();
                this.payment = 0;
                this.close();
              }
            });
          }
        }
      });
    },
  },
  components: {
    VuetifyMoney,
  },
};
</script>
