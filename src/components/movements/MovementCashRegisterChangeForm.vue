<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon large>mdi-swap-horizontal-bold</v-icon>
          Intercambios
        </span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="exchange.cash_register_id"
                :items="cash_registers"
                class="text-center"
                prepend-inner-icon="mdi-cash-register"
                item-text="name"
                item-value="id"
                label="Cajas"
                :error-messages="cashRegisterErrors"
                @input="$v.exchange.cash_register_id.$touch()"
                @blur="$v.exchange.cash_register_id.$touch()"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="dialog = false"
          >Cancel</v-btn
        >
        <v-btn color="blue darken-1" text @click="save()">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapActions, mapState } from "vuex";

export default {
  name: "movement-cash-register-change-form",
  data() {
    return {};
  },
  mixins: [validationMixin],
  validations: {
    exchange: {
      cash_register_id: { required },
      movement_type: { required },
    },
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState("movements", ["exchange", "cash_registers"]),
    ...mapState("cash_registers", ["cash_registers"]),
    cashRegisterErrors() {
      const errors = [];
      if (!this.$v.exchange.cash_register_id.$dirty) return errors;
      !this.$v.exchange.cash_register_id.required &&
        errors.push("La caja es requerida");
      return errors;
    },
    dialog: {
      get: function () {
        return this.value;
      },
      set: function (value) {
        this.$emit("input", value);
      },
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
      this.$v.$reset();
    },
  },
  methods: {
    ...mapActions("movements", ["saveExchangeCashRegister"]),
    ...mapActions("cash_registers", ["getAllCashRegisters"]),

    save() {
      // activate validations form
      this.$v.$touch();

      if (!this.$v.$invalid) {
        // Do update
        this.saveExchangeCashRegister(this.id).then((result) => {
          if (result) {
            // Actualziar el nombre de la caja del movimiento y mandar a consultar nuevamente a las cajas
            this.close();
            // ...
            this.getAllCashRegisters(1);
          }
        });
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.exchange.cash_register_id = "";
        this.exchange.movement_type = "";
      });
    },
  },
};
</script>
