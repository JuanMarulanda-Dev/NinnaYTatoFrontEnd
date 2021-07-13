<template>
  <div>
    <v-text-field
      v-model="cmpValue"
      :prepend-inner-icon="moneyIcon"
      :label="label"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      :outlined="outlined"
      :dense="dense"
      :hide-details="hideDetails"
      :error="error"
      :rules="rules"
      :clearable="clearable"
      :backgroundColor="backgroundColor"
      :prefix="options.prefix"
      :suffix="options.suffix"
      @keypress="keyPress"
      :error-messages="priceErrors"
      @input="$v.cmpValue.$touch()"
      @blur="$v.cmpValue.$touch()"
    ></v-text-field>
  </div>
</template>

<script>
// creador: https://github.com/juareznasato/vuetify-money
import { validationMixin } from "vuelidate";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { required, maxLength } from "vuelidate/lib/validators";
export default {
  name: "vuetify-money",
  model: { prop: "value", event: "input" },
  props: {
    value: {
      // type: String,
      type: [String, Number],
      default: "0",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: undefined,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: [Boolean, String],
      default: false,
    },
    rules: {
      type: [Array, String],
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: "white",
    },
  },
  mixins: [validationMixin, moneyFormatMixin],
  validations: {
    cmpValue: { required, maxLength: maxLength(255) },
  },
  computed: {
    cmpValue: {
      get: function () {
        return this.value !== null && this.value !== ""
          ? this.humanFormat(this.value.toString())
          : this.valueWhenIsEmpty;
      },
      set: function (newValue) {
        this.$emit("input", this.machineFormat(newValue));
      },
    },
    priceErrors() {
      const errors = [];
      if (!this.$v.cmpValue.$dirty) return errors;
      !this.$v.cmpValue.required && errors.push("El valor es requerido");
      !this.$v.cmpValue.maxLength && errors.push("Longitud no permitida");
      return errors;
    },
  },
  methods: {
    keyPress($event) {
      // console.log($event.keyCode); //keyCodes value
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      // if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      if (keyCode < 48 || keyCode > 57) {
        // 46 is dot
        $event.preventDefault();
      }
      if (this.targetLength()) {
        $event.preventDefault();
      }
    },
    onInput() {
      this.input.$touch();
    },
    targetLength() {
      if (
        Number(this.cleanNumber(this.value).length) >=
        Number(this.options.length)
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
