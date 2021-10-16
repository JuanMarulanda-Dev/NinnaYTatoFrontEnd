<template>
  <v-dialog v-model="dialogOutput" persistent scrollable max-width="700px">
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
                :disabled="!user.is_admin"
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
                :disabled="!user.is_admin"
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

            <v-col cols="12" md="6">
              <!-- Debitacion de plan -->
              <v-text-field
                label="Tikets a debitar"
                readonly
                dense
                :value="usedTikets"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <!-- Horas a debitar -->
              <v-text-field label="Horas" readonly dense :value="excess_hours">
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <!-- Total -->
              <vuetify-money
                v-model="calculateTotalExcessHours"
                label="Total"
                readonly
                dense
              />
            </v-col>
            <v-col cols="12" md="6">
              <!-- Pago -->
              <vuetify-money
                v-model="outputData.excess_hours_payment"
                label="Dinero ingresado"
                dense
              />
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
                            :error-messages="cashRegisterErrors"
                            @input="$v.outputData.cash_register_id.$touch()"
                            @blur="$v.outputData.cash_register_id.$touch()"
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

            <v-col cols="12">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span>
                      <v-icon>mdi-basket</v-icon>
                      &nbsp;Accesorios
                    </span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-container>
                      <v-row>
                        <v-col>
                          <v-simple-table fixed-header height="150px">
                            <template v-slot:default>
                              <thead>
                                <tr>
                                  <th class="text-left">Accesorio</th>
                                  <th class="text-left">Descripción</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="(accessory, index) in accessories"
                                  :key="index"
                                >
                                  <td>{{ accessory.name }}</td>
                                  <td>{{ accessory.description }}</td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>

            <v-col cols="12">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span>
                      <v-icon>mdi-cart</v-icon>
                      &nbsp;Costos adicionales
                    </span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-container>
                      <v-row>
                        <v-col>
                          <v-data-table
                            :headers="salesHeaders"
                            :items="sales_lodging"
                            :single-expand="false"
                            :expanded.sync="expanded"
                            :hide-default-footer="true"
                            :disable-sort="true"
                            item-key="sale_id"
                            show-expand
                            class="elevation-1"
                          >
                            <template v-slot:[`item.total`]="{ item }">
                              <v-icon>{{ moneyIcon }}</v-icon>
                              {{ currencyFormat(item.total) }}
                            </template>

                            <template v-slot:[`item.payment`]="{ item }">
                              <vuetify-money
                                class="mt-4"
                                v-model="item.payment"
                                label="Pago"
                                dense
                              />
                            </template>

                            <template v-slot:expanded-item="{ headers, item }">
                              <td class="pa-0" :colspan="headers.length">
                                <v-simple-table fixed-header height="150px">
                                  <template v-slot:default>
                                    <thead>
                                      <tr>
                                        <th class="text-left">Nombre</th>
                                        <th class="text-center">Cantidad</th>
                                        <th class="text-center">valor</th>
                                        <th class="text-center">descuento</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr
                                        v-for="(detail, index) in item.detail"
                                        :key="index"
                                      >
                                        <td>{{ detail.name }}</td>
                                        <td class="text-center">
                                          {{ detail.quantity }}
                                        </td>
                                        <td class="text-center">
                                          {{ currencyFormat(detail.price) }}
                                        </td>
                                        <td class="text-center">
                                          {{ detail.discount }}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </template>
                                </v-simple-table>
                              </td>
                            </template>
                          </v-data-table>
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
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";

function validateSettlement() {
  let result = false;
  if (this.outputData.plan_customer_id !== "") {
    result = true;
  } else {
    if (
      this.outputData.plan_default_id !== "" &&
      this.outputData.cash_register_id !== ""
    ) {
      result = true;
    }
  }
  return result;
}

export default {
  name: "output-form",
  data() {
    return {
      modalDatePicker: false,
      modalTimePicker: false,
      expanded: [],
      excess_hours: 0,
      salesHeaders: [
        {
          text: "C.V",
          align: "start",
          value: "id",
        },
        { text: "total", align: "center", value: "total" },
        { text: "pago", align: "center", value: "payment" },
        { text: "", value: "data-table-expand" },
      ],
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
    accessories: {
      type: Array,
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
    date_search: {
      type: String,
      required: true,
    },
  },
  mixins: [validationMixin, moneyFormatMixin],
  validations: {
    outputData: {
      date: { required },
      time: { required },
      cash_register_id: { validateSettlement },
    },
  },
  components: {
    VuetifyMoney,
  },
  computed: {
    ...mapState(["user"]),
    ...mapState("lodging", [
      "default_plans_details",
      "outputData",
      "sales_lodging",
    ]),
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
        hours = Math.ceil(difference / 3600000);
      }
      return hours;
    },

    usedTikets() {
      let used_tikets = 0;
      used_tikets = this.calculateUsedTikets();

      return used_tikets;
    },

    maxDate() {
      return this.getNowDate();
    },

    total() {
      let total = 0;
      if (
        this.outputData.plan_default_id !== "" &&
        this.outputData.plan_default_id !== undefined &&
        this.outputData.date !== "" &&
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

    calculateTotalExcessHours() {
      // Get total plan horas
      return 3000 * this.excess_hours;
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

    cashRegisterErrors() {
      const errors = [];
      if (!this.$v.outputData.cash_register_id.$dirty) return errors;
      !this.$v.outputData.cash_register_id.validateSettlement &&
        errors.push("La caja es requerida");
      return errors;
    },
  },

  watch: {
    dialogOutput(newValue) {
      if (newValue) {
        if (this.outputData.date === "" && this.outputData.time === "") {
          this.outputData.date = this.getNowDate();
          this.outputData.time = this.getNowTime();
        }
      }
    },
  },

  methods: {
    ...mapActions("lodging", ["storeLodgingDeparture"]),

    diffHours(end, start) {
      let time_start = new Date();
      let time_end = new Date();
      let value_start = start.split(":");
      let value_end = end.split(":");

      time_start.setHours(
        value_start[0],
        value_start[1],
        value_start[2] ?? "00",
        0
      );
      time_end.setHours(value_end[0], value_end[1], value_end[2] ?? "00", 0);

      let diffInMilliSeconds = time_end - time_start; // millisecond

      return Math.ceil(diffInMilliSeconds / 3600000); // Hours
    },

    calculateUsedTikets() {
      let used_tikets = 0;
      let used_hours = 0;
      this.excess_hours = 0;

      if (
        this.outputData.plan_customer_id != "" &&
        this.outputData.date != "" &&
        this.outputData.time != ""
      ) {
        let plan = this.customer_plans.find(
          (plan) => plan.id === this.outputData.plan_customer_id
        );
        // Is it a plan with equivalence ?
        if (plan.equivalence > 0) {
          used_hours = this.calculateHours / plan.equivalence;
          used_tikets = Math.floor(used_hours);
          // Apply validation ?
          if (plan.day_change === 1) {
            // get diif only hours between arrival date and departure date
            let date = this.arrival_date.split(" "); // 0 date - 1 time
            let diff = this.diffHours(this.outputData.time, date[1]);
            //
            if (diff > 0) {
              let day_out = new Date(this.outputData.date).getUTCDate();
              let day_in = new Date(date[0]).getUTCDate();

              if (used_tikets == 0 && day_out != day_in) {
                used_tikets = 1;
              } else {
                this.excess_hours = Math.ceil(diff);
              }
            } else if (diff < 0) {
              used_tikets += 1;
            }
          } else {
            this.excess_hours = Math.ceil(
              (used_hours - used_tikets) * plan.equivalence
            );
          }

          if (plan.tickets < used_tikets) {
            let excess_tikets = used_tikets - plan.tickets;
            // Convert excess tikets in hours
            this.excess_hours += excess_tikets * plan.equivalence;
            //
            used_tikets = plan.tickets;
          }
        }
      }

      return used_tikets;
    },

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
      this.outputData.payment = 0;
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
            sales_payments: this.sales_lodging.map((obj) => ({
              sale_id: obj.sale_id,
              payment: obj.payment,
            })),
          },
          id: this.lodging_id,
          is_close: this.is_close,
          date_search: this.date_search,
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
