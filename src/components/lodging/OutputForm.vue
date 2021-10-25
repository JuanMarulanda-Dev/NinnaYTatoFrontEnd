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

            <v-tabs v-model="tab" color="primary" icons-and-text grow>
              <v-tabs-slider></v-tabs-slider>

              <v-tab href="#liquidacion">
                Liquidación
                <v-icon>mdi-phone</v-icon>
              </v-tab>

              <v-tab href="#accesorios">
                Accesorios
                <v-icon>mdi-basket</v-icon>
              </v-tab>

              <v-tab href="#costos-adicionales">
                Costos Adicionales
                <v-icon>mdi-cart</v-icon>
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item value="liquidacion">
                <v-card flat>
                  <v-card-text>
                    <liquidation-lodging
                      :arrival_date="arrival_date"
                    ></liquidation-lodging>
                  </v-card-text>
                </v-card>
              </v-tab-item>

              <v-tab-item value="accesorios">
                <v-card width="100vw">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12">
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-center">Accesorio</th>
                                <th class="text-center">Descripción</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(accessory, index) in accessories"
                                :key="index"
                              >
                                <td class="text-center">
                                  {{ accessory.name }}
                                </td>
                                <td class="text-center">
                                  {{ accessory.description }}
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tab-item>

              <v-tab-item value="costos-adicionales">
                <v-card flat width="100vw">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12">
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
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
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
import LiquidationLodging from "@/components/lodging/LiquidationLodging.vue";

export default {
  name: "output-form",
  data() {
    return {
      tab: null,
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
      // cash_register_id: { required },
    },
  },
  computed: {
    ...mapState(["user"]),
    ...mapState("lodging", [
      "default_plans_details",
      "outputData",
      "sales_lodging",
    ]),

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

    close() {
      // Reset vuelidate rules
      this.$v.$reset();
      // Close modal
      this.dialogOutput = false;
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
            plan: {
              id: this.outputData.plan.id,
              type: this.outputData.plan.type,
            },
            payment: this.outputData.payment,
            overtime_liquidity_option:
              this.outputData.overtime_liquidity_option,
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

  components: {
    VuetifyMoney,
    LiquidationLodging,
  },
};
</script>
