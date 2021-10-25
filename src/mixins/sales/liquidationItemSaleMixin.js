export const liquidationItemSaleMixin = {
  methods: {
    calculatePriceTotalCartItem(quantity, unit_price, discount = 0) {
      let total = unit_price * quantity;
      return total - total * (discount / 100);
    },

    findDiscountToQuantity(quantity, discounts = []) {
      let discount = 0;
      if (discounts.length > 0) {
        // Find discount to quantity
        let itemDiscount = discounts.find(
          (element) => element.quantity === quantity
        );
        if (itemDiscount) {
          discount = itemDiscount.discount ?? 0;
        }
      }
      return discount;
    },
  },
};
