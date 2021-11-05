<template>
  <v-dialog v-model="dialogEntry" persistent scrollable max-width="700px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon large>mdi-transit-transfer</v-icon>
          {{ formTittle }} ingreso de mascota
        </span>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" class="d-flex justify-center">
              <v-avatar
                tile
                size="250"
                color="grey lighten-1"
                class="my-2 mr-1"
              >
                <img
                  v-if="entryData.pet_id !== '' && findPetAvatar !== null"
                  :src="findPetAvatar"
                  alt="avatar"
                />
                <v-icon v-else dark x-large> mdi-dog-side </v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <!-- entry date -->
              <v-dialog
                ref="dialog"
                v-model="modalDatePicker"
                :disabled="!user.is_admin"
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
                :disabled="!user.is_admin"
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

            <v-col cols="12" md="6" sm="6">
              <v-select
                label="Accesorios"
                multiple
                chips
                :items="accesoriesRender"
                item-text="name"
                item-id="item.id"
                v-model="entryData.accessories"
                return-object
                item-color="secondary"
              >
                <template v-slot:item="data">
                  <template>
                    <v-list-item-content>
                      <v-text-field
                        color="secondary"
                        :label="data.item.name"
                        :value="data.item.description"
                        v-model="data.item.description"
                        dense
                      ></v-text-field>
                    </v-list-item-content>
                  </template>
                </template>
              </v-select>
            </v-col>

            <v-col cols="6" md="4" sm="6" class="py-0">
              <v-switch
                :input-value="entryData.breakfast"
                v-model="entryData.breakfast"
                label="Desayuno"
              ></v-switch>
            </v-col>

            <v-col cols="6" md="4" sm="6" class="py-0">
              <v-switch
                :input-value="entryData.lunch"
                v-model="entryData.lunch"
                label="Almuerzo"
              ></v-switch>
            </v-col>

            <v-col cols="6" md="4" sm="6" class="py-0">
              <v-switch
                :input-value="entryData.dinner"
                v-model="entryData.dinner"
                label="Comida"
              ></v-switch>
            </v-col>

            <v-col cols="6" md="4" sm="6" class="py-0">
              <v-switch
                :input-value="entryData.prize"
                v-model="entryData.prize"
                label="Premios"
              ></v-switch>
            </v-col>

            <v-col cols="6" md="4" sm="6" class="py-0">
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
import { mapActions, mapState, mapMutations } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
function petAvaliable() {
  let result = false;
  if (this.pets.find((pet) => pet.id === this.entryData.pet_id && pet.state)) {
    result = true;
  }
  return result;
}

export default {
  name: "entry-form",
  data() {
    return {
      modalDatePicker: false,
      modalTimePicker: false,
      maxDate: this.getNowDate(),
    };
  },
  model: { prop: "value", event: "input" },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    lodging_id: {
      type: String,
      required: true,
    },
  },
  mixins: [validationMixin],
  validations: {
    entryData: {
      date: { required },
      time: { required },
      pet_id: { required, petAvaliable },
    },
  },
  computed: {
    ...mapState(["user"]),
    ...mapState("lodging", ["pets", "accessories", "entryData"]),
    formTittle() {
      return this.lodging_id !== "" ? "Editar" : "Registrar";
    },

    findPetAvatar() {
      let index = this.pets.findIndex(
        (pet) => pet.id === this.entryData.pet_id
      );
      let avatar = index === -1 ? "" : this.pets[index].avatar;
      return avatar;
    },
    accesoriesRender() {
      let items = this.accessories.slice();
      this.entryData.accessories.map((accessory) => {
        let index = items.findIndex((item) => item.id === accessory.id);
        if (index > -1) {
          items[index].description = accessory.description;
        }
      });
      return items;
    },
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
      !this.$v.entryData.pet_id.petAvaliable &&
        errors.push("La mascota seleccionada no esta activa.");
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

  watch: {
    dialogEntry(newValue) {
      if (newValue) {
        if (this.lodging_id === "") {
          this.entryData.date = this.getNowDate();
          this.entryData.time = this.getNowTime();
        }
      }
    },
  },

  methods: {
    ...mapActions("lodging", ["storeLodging", "updateLodging"]),
    ...mapMutations("lodging", ["SET_DEFAULT_DATA_ENTRY", "SET_ACCESORIES"]),
    close() {
      this.SET_ACCESORIES();
      this.SET_DEFAULT_DATA_ENTRY();
      // Reset vuelidate rules
      this.$v.$reset();
      // Close modal
      this.dialogEntry = false;
    },

    save() {
      // activate validations form
      this.$v.$touch();
      // Correct validations
      if (!this.$v.$invalid) {
        // Validar si es un guardar o actualizar
        let data = {
          pet_id: this.entryData.pet_id,
          accessories: this.entryData.accessories,
          prize: this.entryData.prize,
          walk: this.entryData.walk,
          breakfast: this.entryData.breakfast,
          lunch: this.entryData.lunch,
          dinner: this.entryData.dinner,
          arrival_date: `${this.entryData.date} ${this.entryData.time}`,
          day_instructions: this.entryData.day_instructions,
        };

        if (this.lodging_id !== "") {
          // Update entry
          this.updateLodging({ data, id: this.lodging_id }).then((result) => {
            if (result) {
              this.close();
            }
          });
        } else {
          // Save entry
          this.storeLodging(data).then((result) => {
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
