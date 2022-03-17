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
      <v-text-field label="Tickets extras" :value="ticketsExtra" readonly dense>
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
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import VuetifyMoney from "@/components/vuetifyMoney.vue";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { liquidationItemSaleMixin } from "@/mixins/sales/liquidationItemSaleMixin.js";
import moment from "moment";

export default {
  name: "liquidation-lodging",
  data() {
    return {
      tickets: 0,
      ticketsExtra: 0,
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
  mixins: [validationMixin, moneyFormatMixin, liquidationItemSaleMixin],
  validations: {
    outputData: {
      cash_register_id: { required },
    },
  },
  computed: {
    ...mapState("lodging", [
      "default_plans_details",
      "outputData",
      "sales_lodging",
      "default_liquidation_plan",
    ]),
    ...mapState("customers", ["customer_plans"]),
    ...mapState("cash_registers", ["cash_registers"]),

    plans() {
      return [
        { header: "Planes del cliente" },
        ...this.customer_plans,
        { header: "Planes para liquidar" },
        ...this.default_plans_details,
      ];
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
      !this.$v.outputData.cash_register_id.required &&
        errors.push("La caja es requerida");
      return errors;
    },

    calculateDiscountTicketsExtra() {
      let discount = 0;
      if (this.ticketsExtra > 0) {
        discount =
          this.outputData.plan.unit_plan_detail.discount +
          this.findDiscountToQuantity(
            this.ticketsExtra,
            this.outputData.plan.unit_plan_detail.discounts
          );
      }
      return discount;
    },

    calculateDiscountHourEstraExtra() {
      let discount = 0;
      if (this.hoursExtra > 0) {
        discount =
          this.default_liquidation_plan.discount + // plan 1 - hour
          this.findDiscountToQuantity(
            this.hoursExtra,
            this.default_liquidation_plan.discounts
          );
      }
      return discount;
    },

    totalTimeExtra() {
      let total = 0;
      if (this.ticketsExtra > 0) {
        total += this.calculatePriceTotalCartItem(
          this.ticketsExtra,
          this.outputData.plan.unit_plan_detail.unit_value,
          this.calculateDiscountTicketsExtra
        );
      }

      if (this.hoursExtra > 0) {
        total += this.calculatePriceTotalCartItem(
          this.hoursExtra,
          this.default_liquidation_plan.unit_value,
          this.calculateDiscountHourEstraExtra
        );
      }

      return total;
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

        this.calculateDiscountTicketsByCustomerPlanDayChange();
        // is it a customer plan? 1 = customerplan
        if (this.outputData.plan.type === 1) {
          this.avaliableTicketsDiscountCustomerPlan();

          this.hoursExtraDiscountHasATicketCustomerPlan();
        } else {
          // Liquidation by plan detail
          this.ticketsExtra = this.tickets;
          this.tickets = 0;
        }
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
        this.ticketsExtra = this.tickets - this.outputData.plan.tickets;
        this.tickets -= this.ticketsExtra;
      }
    },

    calculateDiscountTicketsByCustomerPlanDayChange() {
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
      this.ticketsExtra = 0;
      this.hoursExtra = 0;
      this.ticketsExtraDiscount = 0;
      this.hoursExtraDiscount = 0;
    },

    diffHours(start, end) {
      end = this.roundDateTime(end);
      let diffInMilliSeconds = end.diff(start, "seconds");
      return Math.round(diffInMilliSeconds / 3600); // Hours
    },
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
