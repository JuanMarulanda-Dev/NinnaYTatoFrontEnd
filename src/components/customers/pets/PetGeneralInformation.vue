<template>
  <v-row class="mt-5">
    <v-col xs="12" sm="12" md="3" cols="12">
      <v-row justify="center">
        <!-- Pet profile -->
        <image-input v-model="petImage">
          <div slot="activator">
            <v-avatar
              size="150px"
              v-ripple
              v-if="!petImage"
              class="grey lighten-3 mb-3"
            >
              <span>Click para añadir</span>
            </v-avatar>
            <v-avatar size="150px" v-ripple v-else class="mb-3">
              <img :src="petImage.imageURL" alt="avatar" />
            </v-avatar>
          </div>
        </image-input>
        <!-- Race -->
        <v-col cols="12">
          <v-select
            :items="breeds"
            item-text="name"
            item-value="id"
            label="Raza*"
            dense
            v-model="pet.pet_breed_id"
            prepend-icon="mdi-dog"
            :error-messages="pet_breed_idErrors"
            @input="$v.pet.pet_breed_id.$touch()"
            @blur="$v.pet.pet_breed_id.$touch()"
          ></v-select>
        </v-col>
        <!-- Gender -->
        <v-col cols="12">
          <v-row justify="center">
            <v-radio-group
              row
              v-model="pet.pet_gender"
              :error-messages="pet_genderErrors"
              @input="$v.pet.pet_gender.$touch()"
              @blur="$v.pet.pet_gender.$touch()"
            >
              <v-radio
                color="secondary"
                on-icon="mdi-gender-female"
                label="Hembra"
                value="0"
              ></v-radio>
              <v-radio
                color="secondary"
                on-icon="mdi-gender-male"
                label="Macho"
                value="1"
              ></v-radio>
            </v-radio-group>
          </v-row>
        </v-col>
        <!-- Esterilización -->
        <div class="text-center">
          <label>Esterilización</label>
          <v-radio-group row v-model="pet.pet_sterilized">
            <v-radio color="secondary" label="No" value="0"></v-radio>
            <v-radio color="secondary" label="Si" value="1"></v-radio>
          </v-radio-group>
        </div>
      </v-row>
    </v-col>
    <v-col xs="12" sm="12" md="9" cols="12">
      <v-row>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-row>
            <v-col cols="12">
              <!-- Nombre de la mascota -->
              <v-text-field
                label="Nombre*"
                required
                v-model="pet.pet_name"
                prepend-inner-icon="mdi-alphabet-latin"
                :error-messages="pet_nameErrors"
                @input="$v.pet.pet_name.$touch()"
                @blur="$v.pet.pet_name.$touch()"
              ></v-text-field>
            </v-col>
            <v-col xs="12" sm="12" md="6" cols="12">
              <!-- Fecha de nacimiento -->
              <v-dialog
                ref="dialog"
                v-model="modalDatePicker"
                :return-value.sync="pet.pet_birth_date"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="pet.pet_birth_date"
                    :error-messages="pet_birth_dateErrors"
                    @input="$v.pet.pet_birth_date.$touch()"
                    @blur="$v.pet.pet_birth_date.$touch()"
                    label="Fecha de nacimiento*"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :max="now"
                  v-model="pet.pet_birth_date"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modalDatePicker = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog.save(pet.pet_birth_date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col xs="12" sm="12" md="6" cols="12">
              <!-- Edad -->
              <v-text-field v-model="age" label="Edad" disabled></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col xs="12" sm="12" md="6" cols="12">
          <v-row>
            <v-col xs="12" sm="12" md="6" cols="12">
              <v-text-field
                label="Numero de chip"
                required
                v-model="pet.pet_chip_number"
                prepend-inner-icon="mdi-memory"
                :error-messages="pet_chip_numberErrors"
                @input="$v.pet.pet_chip_number.$touch()"
                @blur="$v.pet.pet_chip_number.$touch()"
              ></v-text-field>
            </v-col>
            <v-col xs="12" sm="12" md="6" cols="12">
              <v-select
                :items="furs"
                v-model="pet.pet_fur_id"
                item-text="name"
                item-value="id"
                label="Pelaje*"
                :error-messages="pet_fur_idErrors"
                @input="$v.pet.pet_fur_id.$touch()"
                @blur="$v.pet.pet_fur_id.$touch()"
              ></v-select>
            </v-col>
            <v-col xs="12" sm="12" md="6" cols="12">
              <v-select
                :items="foods"
                v-model="pet.pet_food_id"
                item-text="name"
                item-value="id"
                label="Alimento*"
                :error-messages="pet_food_idErrors"
                @input="$v.pet.pet_food_id.$touch()"
                @blur="$v.pet.pet_food_id.$touch()"
              ></v-select
            ></v-col>
            <v-col xs="12" sm="12" md="6" cols="12">
              <v-select
                :items="sizes"
                v-model="pet.pet_size_id"
                item-text="name"
                item-value="id"
                label="Tamaño*"
                :error-messages="pet_size_idErrors"
                @input="$v.pet.pet_size_id.$touch()"
                @blur="$v.pet.pet_size_id.$touch()"
              ></v-select
            ></v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs="12" sm="12" cols="12">
          <!-- Instrucciones generales -->
          <v-textarea
            outlined
            counter="255"
            v-model="pet.pet_general_instructions"
            name="input-7-4"
            label="Instrucciones Generales"
            :error-messages="pet_general_instructionsErrors"
            @input="$v.pet.pet_general_instructions.$touch()"
            @blur="$v.pet.pet_general_instructions.$touch()"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ImageInput from "@/components/imageUploader.vue";
import { mapState, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  name: "pet-general-information",
  data() {
    return {
      petImage: null,
      races: [{ id: 1, name: "Chanda" }],
      modalDatePicker: false,
      now: new Date().toISOString().substr(0, 10),
    };
  },
  props: {
    // Use "value" to enable using v-model
    value: Boolean,
    validation: Boolean,
  },
  mixins: [validationMixin],
  validations: {
    pet: {
      pet_name: { required, maxLength: maxLength(255) },
      pet_birth_date: { required },
      pet_gender: { required },
      pet_chip_number: { maxLength: maxLength(255) },
      pet_general_instructions: { maxLength: maxLength(255) },
      pet_breed_id: { required },
      pet_size_id: { required },
      pet_fur_id: { required },
      pet_food_id: { required },
    },
  },
  computed: {
    ...mapState("pets", ["pet", "breeds", "sizes", "furs", "foods"]),
    age() {
      // format 1 año-s, 6 mes-es
      if (this.pet.pet_birth_date != "") {
        const diffTime = Math.floor(
          Date.parse(this.now) - Date.parse(this.pet.pet_birth_date)
        );
        let day = 1000 * 60 * 60 * 24;
        let days = Math.floor(diffTime / day);
        let months = Math.floor(days / 31);
        let years = Math.floor(months / 12);
        return `${years} año-s, ${months - years * 12} mes-es`;
      } else {
        return "";
      }
    },
    pet_nameErrors() {
      const errors = [];
      if (!this.$v.pet.pet_name.$dirty) return errors;
      !this.$v.pet.pet_name.required && errors.push("El nombre es requerido");
      !this.$v.pet.pet_name.maxLength && errors.push("Longitud no permitida");
      return errors;
    },
    pet_birth_dateErrors() {
      const errors = [];
      if (!this.$v.pet.pet_birth_date.$dirty) return errors;
      !this.$v.pet.pet_birth_date.required &&
        errors.push("La fecha de nacimiento es requerida");
      return errors;
    },
    pet_genderErrors() {
      const errors = [];
      if (!this.$v.pet.pet_gender.$dirty) return errors;
      !this.$v.pet.pet_gender.required && errors.push("El genero es requerido");
      return errors;
    },
    pet_chip_numberErrors() {
      const errors = [];
      if (!this.$v.pet.pet_chip_number.$dirty) return errors;
      !this.$v.pet.pet_chip_number.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    pet_general_instructionsErrors() {
      const errors = [];
      if (!this.$v.pet.pet_general_instructions.$dirty) return errors;
      !this.$v.pet.pet_general_instructions.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    pet_breed_idErrors() {
      const errors = [];
      if (!this.$v.pet.pet_breed_id.$dirty) return errors;
      !this.$v.pet.pet_breed_id.required && errors.push("La raza es requerida");
      return errors;
    },
    pet_size_idErrors() {
      const errors = [];
      if (!this.$v.pet.pet_size_id.$dirty) return errors;
      !this.$v.pet.pet_size_id.required &&
        errors.push("El tamaño es requerido");
      return errors;
    },
    pet_fur_idErrors() {
      const errors = [];
      if (!this.$v.pet.pet_fur_id.$dirty) return errors;
      !this.$v.pet.pet_fur_id.required && errors.push("El pelaje es requerido");
      return errors;
    },
    pet_food_idErrors() {
      const errors = [];
      if (!this.$v.pet.pet_food_id.$dirty) return errors;
      !this.$v.pet.pet_food_id.required &&
        errors.push("La comida es requerida");
      return errors;
    },
  },
  methods: {
    ...mapActions("pets", [
      "getAllBreeds",
      "getAllSizes",
      "getAllFurs",
      "getAllFood",
    ]),
  },
  created() {
    this.getAllBreeds();
    this.getAllSizes();
    this.getAllFurs();
    this.getAllFood();
    if (this.pet.pet_avatar) {
      this.petImage = {
        imageURL: this.pet.pet_avatar,
      };
    }
  },
  watch: {
    petImage: function () {
      this.pet.pet_image = this.petImage.imageFile;
    },
    pet: {
      handler: function () {
        // // Correct validations
        this.$emit("input", !this.$v.$invalid);
      },
      deep: true,
    },
    validation: function () {
      // Active vue validate to this form.
      this.$v.$touch();
    },
  },
  components: {
    ImageInput,
  },
};
</script>
