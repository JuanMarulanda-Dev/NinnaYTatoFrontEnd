<template>
  <!-- Modal New/edit-->
  <v-dialog v-model="dialog_form" persistent max-width="500px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon large>mdi-book</v-icon>
          {{ formTitle }}
        </span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-dialog
                ref="start"
                v-model="modalDatePickerStart"
                :return-value.sync="editedItem.start"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.start"
                    label="Fecha de ingreso*"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :error-messages="startErrors"
                    @input="$v.editedItem.start.$touch()"
                    @blur="$v.editedItem.start.$touch()"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="editedItem.start" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="modalDatePickerStart = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="
                      $refs.start.save(editedItem.start);
                      searchAvailityRoomsBetweenDates();
                    "
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-dialog
                ref="end"
                v-model="modalDatePickerEnd"
                :return-value.sync="editedItem.end"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.end"
                    label="Fecha de salida*"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :error-messages="endErrors"
                    @input="$v.editedItem.end.$touch()"
                    @blur="$v.editedItem.end.$touch()"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="editedItem.end" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="modalDatePickerEnd = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="
                      $refs.end.save(editedItem.end);
                      searchAvailityRoomsBetweenDates();
                    "
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col cols="12">
              <!-- pet -->
              <v-autocomplete
                label="Mascota*"
                v-model="editedItem.pet_id"
                :items="pets"
                item-value="id"
                item-text="name"
                chips
                :error-messages="petErrors"
                @input="$v.editedItem.pet_id.$touch()"
                @blur="$v.editedItem.pet_id.$touch()"
              >
                <template v-slot:selection="{ item }">
                  <v-chip>
                    <span>
                      {{ item.name }}
                      <v-badge
                        dot
                        class="mx-1"
                        :color="item.state ? 'success' : 'error'"
                      ></v-badge>
                    </span>
                  </v-chip>
                </template>

                <template v-slot:item="{ item }">
                  <span>
                    {{ item.name }}
                    <v-badge
                      class="ml-1"
                      :color="item.state ? 'success' : 'error'"
                    ></v-badge>
                  </span>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <!-- rooms -->
              <v-autocomplete
                label="Habitaciones*"
                :loading="room_loading"
                v-model="editedItem.room_id"
                :items="rooms"
                item-value="id"
                item-text="name"
                chips
                :error-messages="roomErrors"
                @input="$v.editedItem.room_id.$touch()"
                @blur="$v.editedItem.room_id.$touch()"
              >
                <template v-slot:selection="{ item }">
                  <v-chip>
                    <span>
                      {{ item.name }} -
                      <small>
                        ({{ item.capacity }}
                        /
                        {{
                          item.taken > item.capacity
                            ? item.capacity
                            : item.taken
                        }})
                      </small>
                    </span>
                  </v-chip>
                </template>

                <template v-slot:item="{ item }">
                  <span>
                    {{ item.name }} -
                    <small>
                      ({{ item.capacity }}
                      /
                      {{
                        item.taken > item.capacity ? item.capacity : item.taken
                      }})
                    </small>
                  </span>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      modalDatePickerStart: false,
      modalDatePickerEnd: false,
    };
  },
  props: {
    value: {
      //editedIndex
      type: Number,
      default: -1,
    },
    refresh_datatable: {
      type: Number,
      default: 0,
    },
  },
  name: "reservation-form",
  mixins: [validationMixin],
  validations: {
    editedItem: {
      pet_id: { required },
      room_id: { required },
      start: { required },
      end: { required },
    },
  },
  computed: {
    ...mapState("reservations", [
      "reservations",
      "dialog_form",
      "rooms",
      "pets",
      "room_loading",
      "editedItem",
      "defaultItem",
    ]),
    editedIndex: {
      get: function () {
        return this.value;
      },
      set: function (newValue) {
        this.$emit("input", newValue);
      },
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Reserva" : "Editar Reserva";
    },
    petErrors() {
      const errors = [];
      if (!this.$v.editedItem.pet_id.$dirty) return errors;
      !this.$v.editedItem.pet_id.required &&
        errors.push("La mascota es requerida");
      return errors;
    },
    roomErrors() {
      const errors = [];
      if (!this.$v.editedItem.room_id.$dirty) return errors;
      !this.$v.editedItem.room_id.required &&
        errors.push("La habitación es requerida");
      return errors;
    },
    startErrors() {
      const errors = [];
      if (!this.$v.editedItem.start.$dirty) return errors;
      !this.$v.editedItem.start.required &&
        errors.push("La fecha de inicio es requerida");
      return errors;
    },
    endErrors() {
      const errors = [];
      if (!this.$v.editedItem.end.$dirty) return errors;
      !this.$v.editedItem.end.required &&
        errors.push("La fecha de fin es requerida");
      return errors;
    },
  },
  watch: {
    dialog_form() {
      this.$v.$reset();
    },
  },
  methods: {
    ...mapMutations("reservations", ["SET_DIALOG_FORM", "SET_EDIT_ITEM"]),
    ...mapActions("reservations", [
      "getAllRoomsReservationsBetweenDates",
      "storeReservation",
      "updateReservation",
    ]),
    searchAvailityRoomsBetweenDates() {
      if (this.editedItem.start != "" && this.editedItem.end != "") {
        this.getAllRoomsReservationsBetweenDates({
          start: this.editedItem.start,
          end: this.editedItem.end,
        });
      }
    },
    close() {
      this.SET_DIALOG_FORM(false);
      this.$nextTick(() => {
        this.SET_EDIT_ITEM(Object.assign({}, this.defaultItem));
        this.$emit("input", -1); //this.editedIndex = -1;
      });
    },

    save() {
      this.$v.$touch();
      // Correct validations
      if (!this.$v.$invalid) {
        if (this.editedIndex > -1) {
          // Do update
          console.log(this.reservations);
          this.updateReservation(this.reservations[this.editedIndex].id).then(
            (result) => {
              if (result) {
                this.close();
              }
            }
          );
        } else {
          // Do store
          this.storeReservation(this.refresh_datatable).then((result) => {
            if (result) {
              this.close();
            }
          });
        }
      }
    },
  },
};
</script>
