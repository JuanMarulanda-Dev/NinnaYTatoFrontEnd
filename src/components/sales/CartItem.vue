<template>
  <tr>
    <th>{{ item.name }}</th>
    <th class="text-center">
      <vue-number-input
        :value="item.quantity"
        @input="onInput"
        :min="1"
        :max="10"
        inline
        controls
        center
        size="small"
        :disabled="item.item_type === 3"
      ></vue-number-input>
    </th>
    <th class="text-center">
      <v-icon small>{{ moneyIcon }}</v-icon>
      {{ currencyFormat(item.total) }}
    </th>
    <th class="text-center">
      {{ discount }}
    </th>
    <th class="text-center">
      <v-btn medium icon color="primary" @click="deleteCartItem()">
        <v-icon>mdi-close-circle-outline</v-icon>
      </v-btn>
    </th>
  </tr>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import VueNumberInput from "@/components/vueNumberInput.vue";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { liquidationItemSaleMixin } from "@/mixins/sales/liquidationItemSaleMixin.js";
export default {
  name: "cart-item",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  mixins: [moneyFormatMixin, liquidationItemSaleMixin],
  computed: {
    ...mapState("products", ["products"]),
    discount() {
      return (
        this.item.discount +
        this.findDiscountToQuantity(this.item.quantity, this.item.discounts)
      );
    },
  },
  created() {
    this.initialize(this.item.quantity);
  },
  methods: {
    ...mapMutations("sales", [
      "SET_QUANTITY_CART_ITEM",
      "SET_TOTAL_CART_ITEM",
      "DELETE_CART_ITEM",
    ]),

    onInput(newQuantity) {
      let disable = true;

      // Is it a product?
      if (this.item.item_type === 1) {
        disable = this.validateAvaliableStockProduct(
          this.item.item_id,
          newQuantity
        );
        if (!disable) {
          // Does't have stock avaliable.
          this.$toast.warning(
            "No tienes más stock disponible de este producto."
          );
        }
      }

      if (disable) {
        this.initialize(newQuantity);
      }
    },

    initialize(quantity = 1) {
      // Update quantity cart item
      this.SET_QUANTITY_CART_ITEM({ item: this.item, quantity });
      let total = this.calculatePriceTotalCartItem(
        this.item.quantity,
        this.item.unit_price,
        this.discount
      );
      // Update total cart item
      this.SET_TOTAL_CART_ITEM({ item: this.item, total });
    },

    validateAvaliableStockProduct(productId, quantity) {
      let status = false;
      // Search product stack
      let product = this.products.find((product) => product.id === productId);

      if (product) {
        // Are there avaliable product stock?
        status = quantity <= product.stock;
      }
      return status;
    },

    deleteCartItem() {
      this.DELETE_CART_ITEM(this.item);
    },
  },
  watch: {
    item: {
      // This will let Vue know to look inside the array
      deep: true,

      // We have to move our method to a handler field
      handler(item) {
        this.initialize(item.quantity);
      },
    },
  },
  components: {
    VueNumberInput,
  },
};
</script>
