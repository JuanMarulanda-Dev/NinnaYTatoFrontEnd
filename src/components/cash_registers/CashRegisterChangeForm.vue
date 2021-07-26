<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <!-- Button active modal -->
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        fab
        small
        color="secondary"
        elevation="3"
        dark
        v-bind="attrs"
        v-on="on"
        class="mr-2"
      >
        <v-icon>mdi-swap-horizontal-bold</v-icon>
      </v-btn>
    </template>
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
            <v-col cols="12" sm="12" md="6">
              <v-select
                v-model="exchange.cash_register_from_id"
                :items="cash_registers"
                class="text-center"
                prepend-inner-icon="mdi-cash-register"
                item-text="name"
                item-value="id"
                label="¿De donde sale?"
                :error-messages="cashRegisterFromErrors"
                @input="$v.exchange.cash_register_from_id.$touch()"
                @blur="$v.exchange.cash_register_from_id.$touch()"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <v-select
                v-model="exchange.cash_register_to_id"
                :items="cash_registers"
                class="text-center"
                prepend-inner-icon="mdi-cash-register"
                item-text="name"
                item-value="id"
                label="¿A donde va?"
                :error-messages="cashRegisterToErrors"
                @input="$v.exchange.cash_register_to_id.$touch()"
                @blur="$v.exchange.cash_register_to_id.$touch()"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <vuetify-money v-model="exchange.amount" label="Monto*" />
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
import VuetifyMoney from "@/components/vuetifyMoney.vue";

function onlyCashRegister() {
  let result = true;
  if (
    this.exchange.cash_register_from_id !== "" &&
    this.exchange.cash_register_to_id !== ""
  ) {
    result = !(
      this.exchange.cash_register_from_id === this.exchange.cash_register_to_id
    );
  }
  return result;
}

export default {
  name: "cash-register-change-form",
  data() {
    return {
      dialog: false,
    };
  },
  mixins: [validationMixin],
  validations: {
    exchange: {
      cash_register_from_id: { required },
      cash_register_to_id: { required, onlyCashRegister },
    },
  },
  components: {
    VuetifyMoney,
  },
  computed: {
    ...mapState("cash_registers", ["exchange", "cash_registers"]),
    cashRegisterFromErrors() {
      const errors = [];
      if (!this.$v.exchange.cash_register_from_id.$dirty) return errors;
      !this.$v.exchange.cash_register_from_id.required &&
        errors.push("La caja es requerida");
      return errors;
    },
    cashRegisterToErrors() {
      const errors = [];
      if (!this.$v.exchange.cash_register_to_id.$dirty) return errors;
      !this.$v.exchange.cash_register_to_id.required &&
        errors.push("La caja es requerida");
      !this.$v.exchange.cash_register_to_id.onlyCashRegister &&
        errors.push("No puedes enviar la plata a la misma caja");
      return errors;
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
      this.$v.$reset();
    },
  },
  methods: {
    ...mapActions("cash_registers", ["saveExchange"]),

    save() {
      // activate validations form
      this.$v.$touch();

      if (!this.$v.$invalid && this.exchange.amount !== "") {
        // Do update
        this.saveExchange().then((result) => {
          if (result) {
            this.close();
          }
        });
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.exchange.cash_register_from_id = "";
        this.exchange.cash_register_to_id = "";
        this.exchange.amount = "";
      });
    },
  },
};
</script>
