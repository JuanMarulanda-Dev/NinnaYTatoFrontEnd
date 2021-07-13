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
      return this.humanFormat(this.machineFormat(value));
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
    machineFormat(number) {
      if (number) {
        number = this.cleanNumber(number);

        // Ajustar quantidade de zeros esquerda
        number = number.padStart(parseInt(this.options.precision) + 1, "0");
        // Incluir ponto na casa correta, conforme a precisÃ£o configurada
        number =
          number.substring(
            0,
            number.length - parseInt(this.options.precision)
          ) +
          "." +
          number.substring(
            number.length - parseInt(this.options.precision),
            number.length
          );
        if (isNaN(number)) {
          number = this.valueWhenIsEmpty;
        }
      } else {
        number = this.valueWhenIsEmpty;
      }
      if (this.options.precision === 0) {
        number = this.cleanNumber(number);
      }
      return number;
    },
    // Retira todos os caracteres nÃ£o numÃ©ricos e zeros esquerda
    cleanNumber: function (value) {
      let result = "";
      if (value) {
        let flag = false;
        let arrayValue = value.toString().split("");
        for (var i = 0; i < arrayValue.length; i++) {
          if (Number.isInteger(parseInt(arrayValue[i]))) {
            if (!flag) {
              // Retirar zeros esquerda
              if (arrayValue[i] !== "0") {
                result = result + arrayValue[i];
                flag = true;
              }
            } else {
              result = result + arrayValue[i];
            }
          }
        }
      }
      return result;
    },
  },
};
