export const moneyFormatMixin = {
  data() {
    return {
      moneyIcon: process.env.VUE_APP_ICON_MONEY ?? "mdi-currency-usd",
    };
  },
  props: {
    options: {
      type: Object,
      default: function () {
        // Formatt currency
        return {
          locale: process.env.VUE_APP_LOCALE ?? "pt-BR", // Locale to format number
          prefix: process.env.VUE_APP_PREFIX ?? "", // Currency symbol
          suffix: process.env.VUE_APP_SUFFIX ?? "", // % or others
          length: process.env.VUE_APP_LENGTH ?? 10, // Number length
          precision: process.env.VUE_APP_PRECISION ?? 0, //Decimal precision
        };
      },
    },
    valueWhenIsEmpty: {
      type: String,
      default: "", // "0" or "" or null
    },
  },
  methods: {
    currencyFormat(value) {
      return this.humanFormat(value);
    },
    humanFormat: function (number) {
      if (isNaN(number)) {
        number = "";
      } else {
        // number = Number(number).toLocaleString(this.options.locale, {maximumFractionDigits: 2, minimumFractionDigits: 2, style: 'currency', currency: 'BRL'});
        number = Number(number).toLocaleString(this.options.locale, {
          maximumFractionDigits: this.options.precision,
          minimumFractionDigits: this.options.precision,
        });
      }
      return number;
    },
  },
};
