<template>
  <div>
    <v-row>
      <!-- Customer -->
      <v-col :lg="lg" sm="12" md="4" cols="12">
        <v-autocomplete
          v-model="sale.customer_id"
          :items="customers"
          class="pb-3"
          prepend-icon="mdi-paw"
          label="Cliente"
          item-text="name"
          item-value="id"
          :readonly="readonlyCustomer"
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
      <v-col :lg="lg" sm="12" md="8" cols="12">
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
                  :error-messages="cashRegisterErrors"
                  @input="$v.sale.cash_register_id.$touch()"
                  @blur="$v.sale.cash_register_id.$touch()"
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
                <v-text-field
                  label="Devuelta"
                  dense
                  :value="currencyFormat(devuelta)"
                  :prepend-inner-icon="moneyIcon"
                  readonly
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <!-- Actions form -->
      <v-col md="4" cols="12" class="py-0">
        <!-- Products -->
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
      <v-col md="4" cols="12" class="py-0">
        <!-- Services -->
        <v-autocomplete
          v-model="itemSelected"
          :items="plans_details"
          prepend-icon="mdi-note-outline"
          label="Servicios"
          item-text="name"
          return-object
          dense
          :disabled="customerSelected"
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
      <v-col md="4" cols="12" class="d-flex justify-end">
        <v-btn class="mr-2" small color="error" @click="clear()">Limpiar</v-btn>
        <v-btn small color="secondary" @click="save()">Guardar</v-btn>
      </v-col>
    </v-row>
    <sale-additional-charge-form
      @addCartItem="addCartItem($event, -1)"
      :showAdditionalForm="showAdditionalForm"
    ></sale-additional-charge-form>
    <v-row>
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
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import VuetifyMoney from "@/components/vuetifyMoney.vue";
import CartItem from "@/components/sales/CartItem.vue";
import SaleAdditionalChargeForm from "@/components/sales/SaleAdditionalChargeForm.vue";

export default {
  data: () => ({
    changes: 0,
    itemSelected: {},
  }),
  props: {
    lg: {
      type: String,
      default: "0",
    },
    showAdditionalForm: {
      type: Boolean,
      default: false,
    },
    readonlyCustomer: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [validationMixin, moneyFormatMixin],
  validations: {
    sale: {
      cash_register_id: { required },
      cart: { required },
    },
  },
  computed: {
    ...mapState(["mainBranchOffice"]),
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
    devuelta() {
      return this.sale.payment - this.total;
    },
    customerSelected() {
      return this.sale.customer_id === "" || this.sale.customer_id === null;
    },
    cashRegisterErrors() {
      const errors = [];
      if (!this.$v.sale.cash_register_id.$dirty) return errors;
      !this.$v.sale.cash_register_id.required &&
        errors.push("La caja es requerida.");
      return errors;
    },
  },
  created() {
    this.getAllCustomers(1);
    this.getAllCashRegisters(1);
    this.getAllProducts(1);
    this.getAllPlansDetails(1);
    // Obtener los permisos
    this.SET_PERMISSIONS(this.$route.meta.permissions);
  },
  methods: {
    ...mapActions("sales", [
      "storeSale",
      "findDiscountToQuantity",
      "downloadPaymentProof",
    ]),
    ...mapActions("customers", ["getAllCustomers"]),
    ...mapActions("cash_registers", ["getAllCashRegisters"]),
    ...mapActions("products", ["getAllProducts"]),
    ...mapActions("plans_details", ["getAllPlansDetails"]),

    ...mapMutations("sales", ["SET_PERMISSIONS", "SET_SALE_DEFAULT"]),

    validateAvaliableStockProduct(stock) {
      return stock > 0 ? true : false;
    },

    searchSameProductOnTheCart(item_id_selected, item_type_selected) {
      // Products = 1 | Plans = 2
      let cartItemIndex = this.sale.cart.findIndex(
        (item) =>
          item.item_id === item_id_selected &&
          item.item_type === item_type_selected
      );
      return cartItemIndex;
    },

    addCartItem(newItemCart, cartItemIndex) {
      // Item type: 1 = producto, 2 = plan/servicio, 3 = Recargo adicional
      let object = {
        item_id: newItemCart.id,
        item_type: newItemCart.type,
        name: newItemCart.name,
        quantity: 1,
        unit_price: newItemCart.full_value ?? newItemCart.price,
        discount: newItemCart.discount ?? 0,
        discounts: newItemCart.discounts ?? [],
        total: 0,
      };
      if (cartItemIndex > -1) {
        // Incremente quantity to the cart item.
        this.sale.cart[cartItemIndex].quantity++;
      } else {
        // Add new element
        this.sale.cart.push(object);
      }
    },

    save() {
      this.$v.$touch();
      // Correct validations
      if (!this.$v.$invalid) {
        // Confirmation action
        this.$confirm("¿Estas seguro que quieres registrar esta venta?", {
          title: "Advertencia",
        }).then((result) => {
          if (result) {
            // Store
            this.storeSale().then((result) => {
              if (result) {
                this.$v.$reset();
                // Download payment proof
                if (result.print) {
                  this.downloadPaymentProof({
                    saleId: result.saleId,
                    name: result.name,
                  });
                }
                this.SET_SALE_DEFAULT();
                // Research products}
                this.getAllProducts(1);
              }
            });
          }
        });
      } else {
        if (this.sale.cart.length == 0) {
          // Does't have a item
          this.$toast.warning("No tienes ningun producto/plan seleccionado.");
        }
      }
    },

    clear() {
      this.SET_SALE_DEFAULT();
      this.$v.$reset();
    },
  },
  watch: {
    itemSelected(itemSelected) {
      let disponibleToAdd = true;
      let cartItemIndex = this.searchSameProductOnTheCart(
        itemSelected.id,
        itemSelected.type
      );
      // Is it a product?
      if (itemSelected.type === 1) {
        //
        let cartItemQuantity =
          cartItemIndex > -1 ? this.sale.cart[cartItemIndex].quantity : 0;
        //
        disponibleToAdd = this.validateAvaliableStockProduct(
          itemSelected.stock - cartItemQuantity
        );
        if (!disponibleToAdd) {
          // Does't have stock avaliable.
          this.$toast.warning(
            "No tienes stock disponible del producto seleccionado"
          );
        }
      }

      if (disponibleToAdd) {
        this.addCartItem(itemSelected, cartItemIndex);
      }
    },
    mainBranchOffice() {
      this.getAllProducts(1);
      this.SET_SALE_DEFAULT();
    },
  },
  components: {
    VuetifyMoney,
    CartItem,
    SaleAdditionalChargeForm,
  },
};
</script>

<style>
.vue-money-x-large .v-text-field__slot input {
  font-size: x-large !important;
}
</style>
