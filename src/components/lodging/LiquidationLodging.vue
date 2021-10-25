<template>
  <v-row>
    <v-col cols="12" sm="6" md="6">
      <!-- Horas debitadas -->
      <v-text-field
        label="Tiempo debitado (H)"
        readonly
        :value="calculateHours"
      >
      </v-text-field>
    </v-col>

    <v-col cols="12" sm="6" md="6">
      <!-- plans -->
      <v-select
        v-model="outputData.plan"
        :items="plans"
        label="Planes"
        :item-value="(value) => `${value.id}-${value.type}`"
        return-object
        @change="liquidation()"
      >
        <template v-slot:selection="{ item }">
          {{ item.name }}&nbsp;
          <small v-if="item.type === 1"> (Plan del cliente) </small>
          <small v-else> (liquidar) </small>
        </template>
        <template v-slot:item="{ item }">
          <span class="mr-1">
            {{ item.name }}
          </span>
          <small v-if="item.type === 1"> (saldo: {{ item.tickets }}) </small>
          <small v-else>
            (precio: {{ currencyFormat(item.full_value) }})
          </small>
        </template>
      </v-select>
    </v-col>

    <v-col cols="12" md="6">
      <!-- cajas -->
      <v-select
        v-model="outputData.cash_register_id"
        :items="cash_registers"
        label="Cajas"
        item-text="name"
        item-value="id"
        :error-messages="cashRegisterErrors"
        @input="$v.outputData.cash_register_id.$touch()"
        @blur="$v.outputData.cash_register_id.$touch()"
        dense
      ></v-select>
      <!-- :disabled="avaliableFieldCashRegister" -->
    </v-col>

    <v-col cols="12" md="6">
      <!-- Pago -->
      <vuetify-money
        v-model="outputData.payment"
        label="Dinero ingresado"
        dense
      />
    </v-col>

    <v-col cols="12" md="4">
      <!-- Debitacion de plan -->
      <v-text-field
        label="Tikets / Usos completos"
        :value="tickets"
        readonly
        dense
      >
      </v-text-field>
    </v-col>

    <v-col cols="12" md="4">
      <!-- Tickets extras -->
      <v-text-field
        label="Tickets extras"
        :value="ticketsExtras"
        readonly
        dense
      >
      </v-text-field>
    </v-col>

    <v-col cols="12" md="3">
      <!-- Horas extras -->
      <v-text-field label="Horas extras" :value="hoursExtra" readonly dense>
      </v-text-field>
    </v-col>

    <v-col cols="12" md="1">
      <!-- Over time liquidation -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-checkbox
            v-on="on"
            class="mt-0"
            v-model="outputData.overtime_liquidity_option"
            @click="liquidation()"
          ></v-checkbox>
        </template>
        <span>Las horas extras de un tickets del plan</span>
      </v-tooltip>
    </v-col>

    <v-col cols="12" md="4">
      <!-- Total -->
      <vuetify-money v-model="totalTimeExtra" label="Total" readonly dense />
    </v-col>

    <v-col cols="12" md="4">
      <!-- Descuento tickets extra -->
      <v-text-field
        label="Descuento tickets extras (%)"
        v-model="calculateDiscountTicketsExtra"
        readonly
        dense
      >
      </v-text-field>
    </v-col>

    <v-col cols="12" md="4">
      <!-- Descuento tickets extra -->
      <v-text-field
        label="Descuento horas extras (%)"
        v-model="calculateDiscountHourEstraExtra"
        readonly
        dense
      >
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import VuetifyMoney from "@/components/vuetifyMoney.vue";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { liquidationItemSaleMixin } from "@/mixins/sales/liquidationItemSaleMixin.js";
import moment from "moment";

function validateSettlement() {
  let result = false;
  // Is it a plan customer?
  if (this.outputData.plan) {
    return (
      this.outputData.plan.type === 2 && this.outputData.cash_register_id !== ""
    );
  }
  return result;
}

export default {
  name: "liquidation-lodging",
  data() {
    return {
      tickets: 0,
      ticketsExtras: 0,
      hoursExtra: 0,
      ticketsExtraDiscount: 0,
      hoursExtraDiscount: 0,
    };
  },
  props: {
    arrival_date: {
      type: String,
      required: true,
    },
  },
  mixins: [moneyFormatMixin, liquidationItemSaleMixin],
  validations: {
    outputData: {
      cash_register_id: { validateSettlement },
    },
  },
  computed: {
    ...mapState("lodging", [
      "default_plans_details",
      "outputData",
      "sales_lodging",
    ]),
    ...mapState("customers", ["customer_plans"]),
    ...mapState("cash_registers", ["cash_registers"]),

    plans() {
      return [...this.customer_plans, ...this.default_plans_details];
    },

    calculateHours() {
      let hours = 0;
      if (this.outputData.date !== "" && this.outputData.time !== "") {
        let startTime = moment(this.arrival_date);
        let endTime = moment(`${this.outputData.date} ${this.outputData.time}`);

        hours = this.diffHours(startTime, endTime); // This will give difference in milliseconds
      }
      return hours;
    },

    cashRegisterErrors() {
      const errors = [];
      if (!this.$v.outputData.cash_register_id.$dirty) return errors;
      !this.$v.outputData.cash_register_id.validateSettlement &&
        errors.push("La caja es requerida");
      return errors;
    },

    calculateDiscountTicketsExtra() {
      let discount = 0;
      if (this.ticketsExtras > 0) {
        discount =
          this.outputData.plan.discount +
          this.findDiscountToQuantity(
            this.ticketsExtras,
            this.outputData.plan.discounts
          );
      }
      return discount;
    },

    calculateDiscountHourEstraExtra() {
      let discount = 0;
      if (this.hoursExtra > 0) {
        discount =
          this.outputData.plan.discount + // plan 1 - hour
          this.findDiscountToQuantity(
            this.ticketsExtras,
            this.outputData.plan.discounts
          );
      }
      return discount;
    },

    totalTimeExtra() {
      let total = 0;
      if (this.ticketsExtras > 0) {
        total = this.calculatePriceTotalCartItem(
          this.ticketsExtras,
          this.outputData.plan.full_value,
          this.calculateDiscountTicketsExtra
        );
      }
      return total;
    },

    avaliableFieldCashRegister() {
      if (this.outputData.plan) {
        return this.outputData.plan.type === 1;
      }
      return true;
    },
  },
  methods: {
    roundDateTime(datetime) {
      if (datetime instanceof moment) {
        if (datetime.minute() > 30) {
          datetime.add(60 - datetime.minute(), "m");
        } else {
          datetime.subtract(datetime.minute(), "m");
        }
      }
      return datetime;
    },

    liquidation() {
      if (
        this.outputData.plan &&
        this.outputData.time !== "" &&
        this.outputData.date !== ""
      ) {
        this.clearFilds();
        //
        let ticketsRaw = this.calculateTickets(
          this.calculateHours,
          this.outputData.plan.equivalence
        );
        // Calculate full tickets used
        this.tickets = Math.floor(ticketsRaw);

        // Calculate hours extra
        this.hoursExtra = this.calculateHoursExtra(
          ticketsRaw,
          this.outputData.plan.equivalence
        );

        // is it a customer plan? 1 = customerplan
        if (this.outputData.plan.type === 1) {
          this.calculateDiscountCustomerPlan();

          this.avaliableTicketsDiscountCustomerPlan();

          this.hoursExtraDiscountHasATicketCustomerPlan();
        } else {
          // Liquidation by plan detail
          this.ticketsExtras = this.tickets;
          this.tickets = 0;
        }
        // ...
      } else {
        this.clearFilds();
      }
    },

    hoursExtraDiscountHasATicketCustomerPlan() {
      // The hours extras discount one ticket?
      if (this.outputData.overtime_liquidity_option) {
        if (
          this.hoursExtra > 0 &&
          this.outputData.plan.tickets > this.tickets
        ) {
          this.tickets++;
          this.hoursExtra = 0;
        }
      }
    },

    avaliableTicketsDiscountCustomerPlan() {
      // The customer have avaliable tickets to rest?
      if (this.outputData.plan.tickets < this.tickets) {
        this.ticketsExtras = this.tickets - this.outputData.plan.tickets;
        this.tickets -= this.ticketsExtras;
      }
    },

    calculateDiscountCustomerPlan() {
      // Apply day change for this customerplan?
      if (this.outputData.plan.day_change === 1) {
        let diffHours = this.diffHours(
          moment(this.arrival_date),
          moment(`${this.arrival_date.split(" ")[0]} ${this.outputData.time}`)
        );

        if (diffHours < 0) {
          this.tickets++;
          this.hoursExtra = 0;
        }
      }
    },

    calculateTickets(hours, equivalence) {
      return hours / equivalence;
    },

    calculateHoursExtra(tickets, equivalence) {
      let hours = (tickets - Math.floor(tickets)) * equivalence;
      return Math.round(hours);
    },

    clearFilds() {
      this.tickets = 0;
      this.ticketsExtras = 0;
      this.hoursExtra = 0;
      this.ticketsExtraDiscount = 0;
      this.hoursExtraDiscount = 0;
    },

    diffHours(start, end) {
      end = this.roundDateTime(end);
      let diffInMilliSeconds = end.diff(start, "seconds");
      return Math.ceil(diffInMilliSeconds / 3600); // Hours
    },

    // ---
  },
  watch: {
    "outputData.time": function () {
      this.liquidation();
    },
    "outputData.date": function () {
      this.liquidation();
    },
  },
  components: {
    VuetifyMoney,
  },
};
</script>
