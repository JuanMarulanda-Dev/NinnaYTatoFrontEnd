<template>
  <div>
    <!-- Information sale -->
    <v-card elevation="2" class="pa-2">
      <v-container>
        <v-row>
          <!-- Header -->
          <v-toolbar flat color="white" class="rounded-xl">
            <!-- Title Module -->
            <v-toolbar-title>
              <v-icon large>mdi-cart</v-icon> Tienda
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  fab
                  small
                  color="secondary"
                  elevation="3"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </template>
              <span>Buscar Ventas</span>
            </v-tooltip>
          </v-toolbar>
        </v-row>
        <v-row>
          <!-- Customer -->
          <v-col cols="4">
            <v-autocomplete
              v-model="sale.customer_id"
              :items="customers"
              class="pb-3"
              prepend-icon="mdi-paw"
              label="Cliente"
              item-text="name"
              item-value="id"
            >
              <template slot="selection" slot-scope="{ item }">
                {{ item.name }}
              </template>
              <template slot="item" slot-scope="{ item }">
                {{ item.name }}&nbsp;<small>({{ item.dni }})</small>
              </template>
            </v-autocomplete>
            <!-- Options to comprobante de pago -->
            <v-row>
              <v-col>
                <v-card outlined>
                  <v-card-text>
                    <h4 class="text-center">Comprobante de pago</h4>
                  </v-card-text>
                  <v-container class="py-0">
                    <v-row>
                      <v-col>
                        <v-checkbox
                          v-model="sale.print"
                          on-icon="mdi-printer"
                          label="Imprimir"
                        ></v-checkbox>
                      </v-col>
                      <v-col>
                        <v-checkbox
                          v-model="sale.send"
                          on-icon="mdi-email-newsletter"
                          label="Enviar"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <!-- Pagos -->
          <v-col cols="8">
            <v-card outlined>
              <v-card-text class="pb-0">
                <h4 class="text-center">Informacion de pago</h4>
              </v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <v-select
                      v-model="sale.cash_register_id"
                      :items="cash_registers"
                      prepend-inner-icon="mdi-cash-register"
                      item-text="name"
                      item-value="id"
                      label="Caja*"
                    ></v-select>
                  </v-col>
                  <v-col cols="6" class="vue-money-x-large">
                    <vuetify-money v-model="total" label="Total" readonly />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <vuetify-money
                      v-model="sale.payment"
                      label="Dinero ingresado*"
                      dense
                    />
                  </v-col>
                  <v-col cols="6">
                    <vuetify-money
                      v-model="changes"
                      label="Devuelta"
                      readonly
                      dense
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <!-- actions -->
          <v-col cols="4" class="py-0">
            <v-autocomplete
              v-model="itemSelected"
              :items="products"
              prepend-icon="mdi-puzzle"
              label="Productos"
              item-text="name"
              return-object
              dense
            >
              <template slot="item" slot-scope="{ item }">
                {{ item.name }}
                <small>({{ item.stock }})</small>
                <span class="mx-1">-</span>
                <small>
                  <v-icon small>{{ moneyIcon }}</v-icon>
                  {{ currencyFormat(item.price) }}
                </small>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="4" class="py-0">
            <v-autocomplete
              v-model="itemSelected"
              :items="plans_details"
              prepend-icon="mdi-note-outline"
              label="Servicios"
              item-text="name"
              return-object
              dense
            >
              <template slot="item" slot-scope="{ item }">
                {{ item.name }}
                <span class="mx-1">-</span>
                <small>
                  <v-icon small>{{ moneyIcon }}</v-icon>
                  {{ currencyFormat(item.full_value) }}
                </small>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="4" class="d-flex justify-end">
            <v-btn class="mr-2" small color="error">Limpiar</v-btn>
            <v-btn small color="secondary" @click="save()">Guardar</v-btn>
          </v-col>
          <!-- Cart sale -->
          <v-col cols="12">
            <v-simple-table fixed-header height="200px">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-center">Cantidad</th>
                    <th class="text-center">Valor</th>
                    <th class="text-center">Descuento(%)</th>
                    <th class="text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  <cart-item
                    v-for="(item, index) in sale.cart"
                    :item="item"
                    :key="index"
                  ></cart-item>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import VuetifyMoney from "@/components/vuetifyMoney.vue";
import CartItem from "@/components/sales/CartItem.vue";

export default {
  data: () => ({
    changes: 0,
    itemSelected: {},
  }),
  mixins: [moneyFormatMixin],
  computed: {
    ...mapState("sales", ["sales", "sale"]),
    ...mapState("customers", ["customers"]),
    ...mapState("cash_registers", ["cash_registers"]),
    ...mapState("products", ["products"]),
    ...mapState("plans_details", ["plans_details"]),
    total() {
      let result = 0;
      if (this.sale.cart.length > 0) {
        this.sale.cart.forEach((cartItem) => (result += cartItem.total));
      }
      return result;
    },
  },
  created() {
    this.getAllCustomers(1);
    this.getAllCashRegisters(1);
    this.getAllProducts(1);
    this.getAllPlansDetails(1);
  },
  methods: {
    ...mapActions("sales", ["storeSale", "findDiscountToQuantity"]),
    ...mapActions("customers", ["getAllCustomers"]),
    ...mapActions("cash_registers", ["getAllCashRegisters"]),
    ...mapActions("products", ["getAllProducts"]),
    ...mapActions("plans_details", ["getAllPlansDetails"]),

    validateAvaliableStockProduct(product) {
      return product.stock > 0 ? true : false;
    },

    addCartItem(newItemCart) {
      // Item type: 1 = producto, 2 = plan/servicio
      this.sale.cart.push({
        item_id: newItemCart.id,
        item_type: newItemCart.type,
        name: newItemCart.name,
        quantity: 1,
        unit_price: newItemCart.full_value ?? newItemCart.price,
        discount: newItemCart.discount ?? 0,
        discounts: newItemCart.discounts,
        total: 0,
      });
    },

    save() {
      // Confirmation action

      // Store
      this.storeSale();
    },
  },
  watch: {
    itemSelected(itemSelected) {
      let disponibleToAdd = true;
      // Is it a product?
      if (itemSelected.type === 1) {
        disponibleToAdd = this.validateAvaliableStockProduct(itemSelected);
        if (!disponibleToAdd) {
          // Does't have stock avaliable.
          this.$toast.warning(
            "No tienes stock disponible del producto seleccionado"
          );
        }
      }

      if (disponibleToAdd) {
        this.addCartItem(itemSelected);
      }
    },
  },
  components: {
    VuetifyMoney,
    CartItem,
  },
};
</script>

<style>
.vue-money-x-large .v-text-field__slot input {
  font-size: x-large !important;
}
</style>
