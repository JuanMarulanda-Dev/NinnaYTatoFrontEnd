<template>
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
            <v-btn text color="primary" @click="modalDatePickerStart = false">
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
            <v-btn text color="primary" @click="modalDatePickerEnd = false">
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
                  {{ item.taken > item.capacity ? item.capacity : item.taken }})
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
                {{ item.taken > item.capacity ? item.capacity : item.taken }})
              </small>
            </span>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      modalDatePickerStart: false,
      modalDatePickerEnd: false,
    };
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    dialog: {
      type: Boolean,
      required: true,
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
      "rooms",
      "pets",
      "room_loading",
      "editedItem",
      "defaultItem",
    ]),
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
    dialog() {
      this.$v.$reset();
    },
    editedItem: {
      handler() {
        this.$emit("input", !this.$v.$invalid);
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("reservations", ["getAllRoomsReservationsBetweenDates"]),
    searchAvailityRoomsBetweenDates() {
      if (this.editedItem.start != "" && this.editedItem.end != "") {
        this.getAllRoomsReservationsBetweenDates({
          start: this.editedItem.start,
          end: this.editedItem.end,
        });
      }
    },
  },
};
</script>
