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
                :return-value.sync="entryData.date"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="entryData.date"
                    label="Fecha de salida*"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :error-messages="dateErrors"
                    @input="$v.entryData.date.$touch()"
                    @blur="$v.entryData.date.$touch()"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :max="maxDate"
                  v-model="entryData.date"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modalDatePicker = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog.save(entryData.date)"
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
                :return-value.sync="entryData.time"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="entryData.time"
                    label="hora"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :error-messages="timeErrors"
                    @input="$v.entryData.time.$touch()"
                    @blur="$v.entryData.time.$touch()"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="modalTimePicker"
                  v-model="entryData.time"
                  full-width
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modalTimePicker = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.time.save(entryData.time)"
                  >
                    OK
                  </v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <!-- Horas debitadas -->
              <v-text-field label="Tiempo debitado (H)" readonly value="150">
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <!-- plans -->
              <v-select
                label="Planes cliente"
                item-text="name"
                item-value="id"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close()"> Cancel </v-btn>
        <v-btn color="blue darken-1" text @click="save()"> Ingresar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "output-form",
  data() {
    return {
      modalDatePicker: false,
      modalTimePicker: false,
      maxDate: new Date().toISOString().substr(0, 10),
      entryData: {
        pet_id: "",
        attire: {},
        prize: false,
        walks: false,
        date: "",
        time: "",
        instructions: "",
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
  },
  mixins: [validationMixin],
  validations: {
    entryData: {
      date: { required },
      time: { required },
    },
  },
  computed: {
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
      if (!this.$v.entryData.date.$dirty) return errors;
      !this.$v.entryData.date.required && errors.push("La fecha es requerida");
      return errors;
    },
    timeErrors() {
      const errors = [];
      if (!this.$v.entryData.time.$dirty) return errors;
      !this.$v.entryData.time.required && errors.push("La hora es requerida");
      return errors;
    },
  },

  methods: {
    close() {
      // Reset vuelidate rules
      this.$v.$reset();
      // Close modal
      this.dialogOutput = false;
    },

    save() {
      // Save entry
    },
  },
};
</script>
