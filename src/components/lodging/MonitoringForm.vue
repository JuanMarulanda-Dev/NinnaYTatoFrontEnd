<template>
  <v-dialog v-model="dialogMonitoring" scrollable persistent max-width="700px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon large>mdi-timeline</v-icon>
          Seguimiento <small>({{ pet_name }})</small>
        </span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="dialogAddMonitoring = true"
              color="secondary"
              icon
              v-bind="attrs"
              v-on="on"
              v-show="add_monitoring"
            >
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>
          </template>
          <span>Agregar seguimiento</span>
        </v-tooltip>
        <v-dialog v-model="dialogAddMonitoring" persistent max-width="500px">
          <!-- Modal Form -->
          <v-card>
            <v-card-title>
              <span class="headline">
                <v-icon large>mdi-timeline</v-icon>
                Registrar seguimiento
              </span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6" sm="6">
                    <!-- entry date -->
                    <v-dialog
                      ref="dialog"
                      v-model="modalDatePicker"
                      :return-value.sync="monitoring.date"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="monitoring.date"
                          label="Fecha del evento*"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :error-messages="dateErrors"
                          @input="$v.monitoring.date.$touch()"
                          @blur="$v.monitoring.date.$touch()"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        :max="maxDate"
                        v-model="monitoring.date"
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="modalDatePicker = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.dialog.save(monitoring.date)"
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
                      :return-value.sync="monitoring.time"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="monitoring.time"
                          label="hora"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :error-messages="timeErrors"
                          @input="$v.monitoring.time.$touch()"
                          @blur="$v.monitoring.time.$touch()"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="modalTimePicker"
                        v-model="monitoring.time"
                        full-width
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="modalTimePicker = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.time.save(monitoring.time)"
                        >
                          OK
                        </v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <!-- Imagen -->
                    <v-file-input
                      required
                      v-model="monitoring.image"
                      placeholder="Imagen"
                      label="Imagen"
                    ></v-file-input>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <!-- type -->
                    <v-select
                      :items="monitoring_types"
                      item-value="id"
                      item-text="name"
                      v-model="monitoring.monitoring_type_id"
                      label="Tipo"
                      :error-messages="typeErrors"
                      @input="$v.monitoring.monitoring_type_id.$touch()"
                      @blur="$v.monitoring.monitoring_type_id.$touch()"
                    ></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-radio-group
                      v-model="monitoring.option_id"
                      row
                      class="d-flex justify-space-around"
                    >
                      <v-radio
                        v-for="(item, index) in monitoring_options"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>

                  <v-col cols="12">
                    <!-- description -->
                    <v-textarea
                      outlined
                      counter="255"
                      v-model="monitoring.description"
                      name="input-7-4"
                      label="Descripción"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" text @click="closeFormMonitoring()"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="save()">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
                <v-avatar size="100" color="grey lighten-1" class="my-2 mr-1">
                  <img v-if="pet_avatar" :src="pet_avatar" alt="avatar" />
                  <v-icon v-else dark x-large> mdi-dog-side </v-icon>
                </v-avatar>
              </template>
            </v-timeline-item>

            <!-- Timeline -->
            <template>
              <div v-for="(day, index) in monitoringsFormat" :key="index">
                <!-- day change -->
                <v-card light flat>
                  <v-container class="ml-4">
                    <v-layout align-center>
                      <strong class="display-1 font-weight-regular mr-4">
                        {{ day.dayNumber }}
                      </strong>
                      <v-layout column justify-end>
                        <div class="title font-weight-light">
                          {{ day.day }}
                        </div>
                        <div class="text-uppercase font-weight-light">
                          {{ day.month }} {{ day.year }}
                        </div>
                      </v-layout>
                    </v-layout>
                  </v-container>
                </v-card>

                <!-- Evento -->
                <v-timeline-item
                  v-for="(event, index) in day.events"
                  :key="index"
                  class="mb-4"
                  :color="event.color"
                  :icon="event.icon"
                >
                  <v-card class="elevation-2">
                    <v-card-text>
                      <v-row justify="space-between">
                        <v-col cols="7">
                          <h4>
                            {{ event.type }}
                            <small v-show="event.option_name !== null"
                              >({{ event.option_name }})</small
                            >
                          </h4>
                          <p>{{ event.description }}</p>
                        </v-col>
                        <v-col class="text-right" cols="5">
                          <div>
                            <h3>{{ event.time }}</h3>
                            <v-btn
                              @click="deleteMonitoring(event.id)"
                              x-small
                              fab
                              color="error"
                              v-show="add_monitoring"
                            >
                              <v-icon x-small>mdi-close-thick</v-icon>
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                      <v-img
                        v-if="event.image_url !== null"
                        :src="event.image_url"
                      ></v-img>
                    </v-card-text>
                  </v-card>
                </v-timeline-item>
              </div>
            </template>
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
import { mapState, mapActions } from "vuex";

export default {
  name: "monitoring-form",
  data() {
    return {
      dialog: false,
      dialogAddMonitoring: false,
      modalDatePicker: false,
      modalTimePicker: false,
      maxDate: this.getNowDate(),
      monitoring: {
        monitoring_type_id: "",
        option_id: "",
        date: "",
        time: "",
        image: null,
        description: "",
      },
      monitoring_default: {
        monitoring_type_id: "",
        option_id: "",
        date: "",
        time: "",
        image: null,
        description: "",
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
    pet_avatar: {
      type: String,
      default: null,
    },
    lodging_id: {
      type: String,
      required: true,
    },
    add_monitoring: {
      type: Boolean,
      required: true,
    },
  },
  mixins: [validationMixin],
  validations: {
    monitoring: {
      monitoring_type_id: { required },
      date: { required },
      time: { required },
    },
  },
  computed: {
    ...mapState("monitorings", [
      "monitorings",
      "monitoring_types",
      "monitoring_options",
    ]),
    monitoringsFormat() {
      let lastDate = null;
      let timeline = [];
      let count = -1;
      let object = {
        date: "",
        events: [],
      };

      function makeEventFormat(event) {
        return {
          description: event.description,
          id: event.id,
          time: event.time,
          image_url: event.image_url,
          type: event.type,
          color: event.color,
          icon: event.icon,
          option_color: event.option_color,
          option_name: event.option_name,
        };
      }

      this.monitorings.forEach((element) => {
        let date = element.date.split(" ", 1);
        if (date[0] === lastDate) {
          timeline[count].events.push(makeEventFormat(element));
        } else {
          lastDate = date[0];
          timeline.push(Object.assign({}, object));
          count++;
          timeline[count].events = [];
          timeline[count].date = date;
          timeline[count].day = element.day;
          timeline[count].dayNumber = element.dayNumber;
          timeline[count].month = element.month;
          timeline[count].year = element.year;
          timeline[count].events.push(makeEventFormat(element));
        }
      });

      return timeline;
    },
    dialogMonitoring: {
      get: function () {
        return this.value;
      },
      set: function (newValue) {
        this.$emit("input", newValue);
      },
    },
    dateErrors() {
      const errors = [];
      if (!this.$v.monitoring.date.$dirty) return errors;
      !this.$v.monitoring.date.required && errors.push("La fecha es requerida");
      return errors;
    },
    timeErrors() {
      const errors = [];
      if (!this.$v.monitoring.time.$dirty) return errors;
      !this.$v.monitoring.time.required && errors.push("La hora es requerida");
      return errors;
    },

    typeErrors() {
      const errors = [];
      if (!this.$v.monitoring.monitoring_type_id.$dirty) return errors;
      !this.$v.monitoring.monitoring_type_id.required &&
        errors.push("El tipo de seguimiento es requerido");
      return errors;
    },
  },

  watch: {
    dialogAddMonitoring(newValue) {
      if (newValue) {
        this.monitoring.date = this.getNowDate();
        this.monitoring.time = this.getNowTime();
      }
    },
  },

  methods: {
    ...mapActions("monitorings", [
      "storeMonitoring",
      "deleteMonitoringPet",
      "getMonitoryByPetLodging",
    ]),

    ...mapActions("lodging", ["getAllLodging"]),

    close() {
      // Close modal
      this.dialogMonitoring = false;
    },

    closeFormMonitoring() {
      // Reset vuelidate rules
      this.$v.$reset();

      this.monitoring = Object.assign({}, this.monitoring_default);

      // Close modal
      this.dialogAddMonitoring = false;
    },

    deleteMonitoring(id) {
      this.$confirm(`¿Seguro quieres eliminar este seguimiento?`, {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          this.deleteMonitoringPet(id).then((result) => {
            if (result) {
              this.getMonitoryByPetLodging(this.lodging_id);
              this.getAllLodging({ status: 1 });
            }
          });
        }
      });
    },

    save() {
      // activate validations form
      this.$v.$touch();
      // Correct validations
      if (!this.$v.$invalid) {
        // Save entry
        this.storeMonitoring({
          id: this.lodging_id,
          data: {
            monitoring_type_id: this.monitoring.monitoring_type_id,
            date: `${this.monitoring.date} ${this.monitoring.time}`,
            image: this.monitoring.image,
            description: this.monitoring.description,
            option_id: this.monitoring.option_id,
          },
        }).then((result) => {
          if (result) {
            this.closeFormMonitoring();
            this.getAllLodging({ status: 1 });
          }
        });
      }
    },
  },
};
</script>
