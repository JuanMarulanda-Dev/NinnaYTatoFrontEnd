<template>
  <v-dialog v-model="dialogEntry" persistent max-width="700px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon large>mdi-transit-transfer</v-icon>
          Registrar ingreso de mascota
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
                    label="Fecha de ingreso*"
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

            <v-col cols="12" md="6" sm="6">
              <!-- pet -->
              <v-autocomplete
                label="Mascota*"
                v-model="entryData.pet_id"
                :items="pets"
                item-value="id"
                item-text="name"
                chips
                :error-messages="petErrors"
                @input="$v.entryData.pet_id.$touch()"
                @blur="$v.entryData.pet_id.$touch()"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="6" sm="6">
              <v-autocomplete
                label="Accesorios"
                multiple
                chips
                :items="accessories"
                v-model="entryData.accessories"
              >
                <template v-slot:item="data">
                  <template>
                    <v-list-item-content>
                      <!-- <v-checkbox
                        :input-value="data.attrs"
                        color="secondary"
                        class="mx-2"
                        dense
                      ></v-checkbox> -->
                      <v-text-field
                        :label="data.item.name"
                        v-model="data.item.description"
                        dense
                      ></v-text-field>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="6" md="6" sm="6" class="py-0">
              <v-switch
                :input-value="entryData.prize"
                v-model="entryData.prize"
                label="Premios"
              ></v-switch>
            </v-col>

            <v-col cols="6" md="6" sm="6" class="py-0">
              <v-switch
                :input-value="entryData.walk"
                v-model="entryData.walk"
                label="Paseos"
              ></v-switch>
            </v-col>

            <v-col cols="12" class="py-0">
              <v-textarea
                outlined
                height="100"
                v-model="entryData.day_instructions"
                label="Instrucciones del día"
              ></v-textarea>
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
import { mapActions, mapState } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "entry-form",
  data() {
    return {
      modalDatePicker: false,
      modalTimePicker: false,
      maxDate: new Date().toISOString().substr(0, 10),
      entryData: {
        pet_id: "",
        accessories: {},
        prize: false,
        walk: false,
        date: "",
        time: "",
        day_instructions: "",
      },
      entryDataDefault: {
        pet_id: "",
        accessories: {},
        prize: false,
        walk: false,
        date: "",
        time: "",
        day_instructions: "",
      },
    };
  },
  model: { prop: "value", event: "input" },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  mixins: [validationMixin],
  validations: {
    entryData: {
      date: { required },
      time: { required },
      pet_id: { required },
    },
  },
  computed: {
    ...mapState("lodging", ["pets", "accessories"]),
    dialogEntry: {
      get: function () {
        return this.value;
      },
      set: function (newValue) {
        this.$emit("input", newValue);
      },
    },
    petErrors() {
      const errors = [];
      if (!this.$v.entryData.pet_id.$dirty) return errors;
      !this.$v.entryData.pet_id.required &&
        errors.push("La mascota es requerida");
      return errors;
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
    ...mapActions("lodging", ["storeLodging"]),

    close() {
      this.entryData = Object.assign({}, this.entryDataDefault);
      // Reset vuelidate rules
      this.$v.$reset();
      // Close modal
      this.dialogEntry = false;
    },

    save() {
      // Validar si es un guardar o actualizar
      let data = {
        pet_id: this.entryData.pet_id,
        accessories: this.entryData.accessories,
        prize: this.entryData.prize,
        walk: this.entryData.walk,
        arrival_date: `${this.entryData.date} ${this.entryData.time}`,
        day_instructions: this.entryData.day_instructions,
      };

      // Save entry
      this.storeLodging(data).then((result) => {
        if (result) {
          this.close();
        }
      });
    },
  },
};
</script>
