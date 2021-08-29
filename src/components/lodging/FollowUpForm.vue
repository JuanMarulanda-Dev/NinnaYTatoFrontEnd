<template>
  <v-dialog v-model="dialogOutput" scrollable persistent max-width="700px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon large>mdi-timeline</v-icon>
          Seguimiento <small>({{ pet_name }})</small>
        </span>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-timeline dense clipped>
            <v-timeline-item
              fill-dot
              class="white--text mb-12"
              color="orange"
              large
            >
              <template v-slot:icon>
                <span>JL</span>
              </template>
              <v-text-field
                v-model="input"
                hide-details
                flat
                label=""
                solo
                @keydown.enter="comment"
              >
                <template v-slot:append>
                  <v-btn class="mx-0" depressed @click="comment">
                    Nuevo Seguimiento
                  </v-btn>
                </template>
              </v-text-field>
            </v-timeline-item>

            <v-slide-x-transition group>
              <v-timeline-item
                v-for="event in timeline"
                :key="event.id"
                class="mb-4"
                color="pink"
                small
              >
                <v-row justify="space-between">
                  <v-col cols="7" v-text="event.text"></v-col>
                  <v-col
                    class="text-right"
                    cols="5"
                    v-text="event.time"
                  ></v-col>
                </v-row>
              </v-timeline-item>
            </v-slide-x-transition>

            <!-- day change -->
            <v-card light flat>
              <v-container class="ml-4">
                <v-layout align-center>
                  <strong class="display-1 font-weight-regular mr-4">8</strong>
                  <v-layout column justify-end>
                    <div class="title font-weight-light">Lunes</div>
                    <div class="text-uppercase font-weight-light">
                      Febrero 2021
                    </div>
                  </v-layout>
                </v-layout>
              </v-container>
            </v-card>

            <v-timeline-item
              class="mb-4"
              color="grey"
              icon-color="grey lighten-2"
            >
              <v-row justify="space-between">
                <v-col cols="7"> Ingreso de la mascota </v-col>
                <v-col class="text-right" cols="5"> <h3>12:00 pm</h3> </v-col>
              </v-row>
            </v-timeline-item>
          </v-timeline>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close()"> Cerrar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "follow-up-form",
  data() {
    return {
      // Time line
      events: [],
      input: null,
      nonce: 0,

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
    timeline() {
      return this.events.slice().reverse();
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
    comment() {
      const time = new Date().toTimeString();
      this.events.push({
        id: this.nonce++,
        text: this.input,
        time: time.replace(/:\d{2}\sGMT-\d{4}\s\((.*)\)/, (match, contents) => {
          return ` ${contents
            .split(" ")
            .map((v) => v.charAt(0))
            .join("")}`;
        }),
      });

      this.input = null;
    },

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
