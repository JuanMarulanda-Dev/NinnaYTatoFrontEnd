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
                :return-value.sync="formData.date"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formData.date"
                    label="Fecha de salida*"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :error-messages="dateErrors"
                    @input="$v.formData.date.$touch()"
                    @blur="$v.formData.date.$touch()"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :max="maxDate"
                  v-model="formData.date"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modalDatePicker = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog.save(formData.date)"
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
                :return-value.sync="formData.time"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formData.time"
                    label="hora"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :error-messages="timeErrors"
                    @input="$v.formData.time.$touch()"
                    @blur="$v.formData.time.$touch()"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="modalTimePicker"
                  v-model="formData.time"
                  full-width
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modalTimePicker = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.time.save(formData.time)"
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
                v-model="formData.plan_customer_id"
                :items="customer_plans"
                label="Planes cliente"
                item-text="name"
                item-value="id"
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
                            v-model="formData.plan_default_id"
                            :items="default_plans_details"
                            label="Planes"
                            item-text="name"
                            item-value="id"
                            dense
                          >
                          </v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <!-- cajas -->
                          <v-select
                            v-model="formData.cash_register_id"
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
                            v-model="formData.payment"
                            label="Dinero ingresado"
                            dense
                          />
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <!-- Total -->
                          <vuetify-money label="Total" readonly dense />
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
      formData: {
        date: "",
        time: "",
        plan_customer_id: "",
        plan_defult_id: "",
        payment: "",
        cash_register_id: "",
      },
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
    pet_id: {
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
  },
  mixins: [validationMixin],
  validations: {
    formData: {
      date: { required },
      time: { required },
    },
  },
  components: {
    VuetifyMoney,
  },
  computed: {
    ...mapState("lodging", ["default_plans_details"]),
    ...mapState("customers", ["customer_plans"]),
    ...mapState("cash_registers", ["cash_registers"]),
    calculateHours() {
      let hours = 0;
      if (this.formData.date !== "" && this.formData.time !== "") {
        let startTime = Date.parse(this.arrival_date);
        let endTime = Date.parse(`${this.formData.date} ${this.formData.time}`);
        let difference = endTime - startTime; // This will give difference in milliseconds
        hours = Math.ceil((difference % 86400000) / 3600000);
      }
      return hours;
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
      if (!this.$v.formData.date.$dirty) return errors;
      !this.$v.formData.date.required && errors.push("La fecha es requerida");
      return errors;
    },
    timeErrors() {
      const errors = [];
      if (!this.$v.formData.time.$dirty) return errors;
      !this.$v.formData.time.required && errors.push("La hora es requerida");
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

    save() {
      // Save depure
      this.storeLodgingDeparture({
        data: {
          departure_date: `${this.formData.date} ${this.formData.time}`,
          plan_customer_id: this.formData.plan_customer_id,
          plan_default_id: this.formData.plan_default_id,
          payment: this.formData.payment,
          cash_register_id: this.formData.cash_register_id,
        },
        id: this.lodging_id,
      }).then((result) => {
        if (result) {
          this.close();
        }
      });
    },
  },
};
</script>
