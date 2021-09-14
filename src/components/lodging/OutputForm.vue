<template>
  <v-dialog v-model="dialogOutput" persistent max-width="700px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon large>mdi-transit-transfer</v-icon>
          Registrar salida de mascota <small>({{ pet_name }})</small>
        </span>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6" sm="6">
              <!-- entry date -->
              <v-dialog
                ref="dialog"
                v-model="modalDatePicker"
                :return-value.sync="outputData.date"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="outputData.date"
                    label="Fecha de salida*"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :error-messages="dateErrors"
                    @input="$v.outputData.date.$touch()"
                    @blur="$v.outputData.date.$touch()"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :max="maxDate"
                  v-model="outputData.date"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modalDatePicker = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog.save(outputData.date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <!-- entry time -->
              <v-dialog
                ref="time"
                v-model="modalTimePicker"
                :return-value.sync="outputData.time"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="outputData.time"
                    label="hora"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :error-messages="timeErrors"
                    @input="$v.outputData.time.$touch()"
                    @blur="$v.outputData.time.$touch()"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="modalTimePicker"
                  v-model="outputData.time"
                  full-width
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modalTimePicker = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.time.save(outputData.time)"
                  >
                    OK
                  </v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <!-- Horas debitadas -->
              <v-text-field
                label="Tiempo debitado (H)"
                readonly
                v-model="calculateHours"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <!-- plans -->
              <v-select
                v-model="outputData.plan_customer_id"
                :items="customer_plans"
                label="Planes cliente"
                item-text="name"
                item-value="id"
                @change="clean_field_default_plan()"
              >
                <template v-slot:item="{ item }">
                  <span class="mr-1">
                    {{ item.name }}
                  </span>
                  <small> (saldo: {{ item.tickets }}) </small>
                </template>
              </v-select>
            </v-col>

            <v-col cols="12">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span>
                      <v-icon>mdi-account-cash-outline</v-icon>
                      &nbsp;Liquidación
                    </span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <!-- plans -->
                          <v-select
                            v-model="outputData.plan_default_id"
                            :items="default_plans_details"
                            label="Planes"
                            item-text="name"
                            item-value="id"
                            dense
                            @change="clean_field_customer_plan()"
                          >
                          </v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <!-- cajas -->
                          <v-select
                            v-model="outputData.cash_register_id"
                            :items="cash_registers"
                            label="Cajas"
                            item-text="name"
                            item-value="id"
                            dense
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <!-- Dinero ingresado -->
                          <vuetify-money
                            v-model="outputData.payment"
                            label="Dinero ingresado"
                            dense
                          />
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <!-- Total -->
                          <vuetify-money
                            :value="total"
                            label="Total"
                            readonly
                            dense
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close()"> Cancel </v-btn>
        <v-btn color="blue darken-1" text @click="save()"> Dar salida </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import VuetifyMoney from "@/components/vuetifyMoney.vue";

export default {
  name: "output-form",
  data() {
    return {
      modalDatePicker: false,
      modalTimePicker: false,
      maxDate: new Date().toISOString().substr(0, 10),
    };
  },
  model: { prop: "value", event: "input" },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    pet_name: {
      type: String,
      required: true,
    },
    lodging_id: {
      type: String,
      required: true,
    },
    arrival_date: {
      type: String,
      required: true,
    },
    is_close: {
      type: Boolean,
      required: true,
    },
  },
  mixins: [validationMixin],
  validations: {
    outputData: {
      date: { required },
      time: { required },
    },
  },
  components: {
    VuetifyMoney,
  },
  computed: {
    ...mapState("lodging", ["default_plans_details", "outputData"]),
    ...mapState("customers", ["customer_plans"]),
    ...mapState("cash_registers", ["cash_registers"]),
    calculateHours() {
      let hours = 0;
      if (this.outputData.date !== "" && this.outputData.time !== "") {
        let startTime = Date.parse(this.arrival_date);
        let endTime = Date.parse(
          `${this.outputData.date} ${this.outputData.time}`
        );
        let difference = endTime - startTime; // This will give difference in milliseconds
        hours = Math.ceil((difference % 86400000) / 3600000);
      }
      return hours;
    },
    total() {
      let total = 0;
      if (
        this.outputData.plan_default_id !== "" &&
        this.outputData !== "" &&
        this.outputData.time !== ""
      ) {
        let plan_default_id = this.outputData.plan_default_id;
        let plan = this.default_plans_details.find(
          (item) => item.id === plan_default_id
        );
        let hours = this.calculateHours;
        let quantity = Math.ceil(hours / (plan.quantity * plan.equivalence));
        let price = plan.full_value * quantity;

        let default_discount = plan.discount;
        let quantity_discount = this.findDiscountToQuantity(
          quantity,
          plan.discounts
        );

        total = price - price * ((quantity_discount + default_discount) / 100);
      }
      return total;
    },
    dialogOutput: {
      get: function () {
        return this.value;
      },
      set: function (newValue) {
        this.$emit("input", newValue);
      },
    },
    dateErrors() {
      const errors = [];
      if (!this.$v.outputData.date.$dirty) return errors;
      !this.$v.outputData.date.required && errors.push("La fecha es requerida");
      return errors;
    },
    timeErrors() {
      const errors = [];
      if (!this.$v.outputData.time.$dirty) return errors;
      !this.$v.outputData.time.required && errors.push("La hora es requerida");
      return errors;
    },
  },

  methods: {
    ...mapActions("lodging", ["storeLodgingDeparture"]),
    close() {
      // Reset vuelidate rules
      this.$v.$reset();
      // Close modal
      this.dialogOutput = false;
    },

    clean_field_customer_plan() {
      this.outputData.plan_customer_id = "";
    },

    clean_field_default_plan() {
      this.outputData.plan_default_id = "";
      this.outputData.payment = "";
      this.outputData.cash_register_id = "";
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

    save() {
      // activate validations form
      this.$v.$touch();
      // Correct validations
      if (!this.$v.$invalid) {
        // Save depure
        this.storeLodgingDeparture({
          data: {
            departure_date: `${this.outputData.date} ${this.outputData.time}`,
            plan_customer_id: this.outputData.plan_customer_id,
            plan_default_id: this.outputData.plan_default_id,
            payment: this.outputData.payment,
            cash_register_id: this.outputData.cash_register_id,
          },
          id: this.lodging_id,
          is_close: this.is_close,
        }).then((result) => {
          if (result) {
            this.close();
          }
        });
      }
    },
  },
};
</script>
