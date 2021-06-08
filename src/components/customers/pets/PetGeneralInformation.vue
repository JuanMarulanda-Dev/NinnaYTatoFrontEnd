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
            :items="races"
            item-text="name"
            item-value="id"
            label="Raza"
            dense
            v-model="pet.pet_breed_id"
            prepend-icon="mdi-dog"
          ></v-select>
        </v-col>
        <!-- Gender -->
        <v-col cols="12">
          <v-row justify="center">
            <v-radio-group row v-model="pet.pet_gender">
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
        <v-switch
          v-model="pet.pet_sterilized"
          label="Esterilización"
        ></v-switch>
      </v-row>
    </v-col>
    <v-col xs="12" sm="12" md="9" cols="12">
      <v-row>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-row>
            <v-col cols="12">
              <!-- Nombre de la mascota -->
              <v-text-field
                label="Nombre"
                required
                v-model="pet.pet_name"
                prepend-inner-icon="mdi-alphabet-latin"
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
                    label="Fecha de nacimiento"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="pet.pet_birth_date" scrollable>
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
              <v-text-field label="Edad" disabled></v-text-field>
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
              ></v-text-field>
            </v-col>
            <v-col xs="12" sm="12" md="6" cols="12">
              <v-select
                :items="races"
                v-model="pet.pet_fur_id"
                item-text="name"
                item-value="id"
                label="Pelaje"
              ></v-select>
            </v-col>
            <v-col xs="12" sm="12" md="6" cols="12">
              <v-select
                :items="races"
                v-model="pet.pet_food_id"
                item-text="name"
                item-value="id"
                label="Alimento"
              ></v-select
            ></v-col>
            <v-col xs="12" sm="12" md="6" cols="12">
              <v-select
                :items="races"
                v-model="pet.pet_size_id"
                item-text="name"
                item-value="id"
                label="Tamaño"
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
            v-model="pet.pet_general_instructions"
            name="input-7-4"
            label="Instrucciones Generales"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ImageInput from "@/components/imageUploader.vue";
import { mapState } from "vuex";

export default {
  name: "pet-general-information",
  data() {
    return {
      petImage: null,
      races: [{ id: 1, name: "Chanda" }],
      modalDatePicker: false,
      date: new Date().toISOString().substr(0, 10),
    };
  },
  computed: {
    ...mapState("pets", ["pet"]),
  },
  watch: {
    petImage: function () {
      this.pet.pet_avatar = this.petImage.formData;
    },
  },
  components: {
    ImageInput,
  },
};
</script>
