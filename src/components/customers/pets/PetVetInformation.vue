<template>
  <v-row class="mt-5">
    <v-col xs="12" sm="12" md="3" cols="12">
      <v-row>
        <v-col xs="12" sm="12" cols="12">
          <v-text-field
            label="Veterinario de confianza"
            required
            v-model="vet_information.veterinarian_name"
            prepend-inner-icon="mdi-card-account-details-outline"
          ></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" cols="12">
          <v-text-field
            label="Teléfono"
            required
            v-model="vet_information.veterinarian_phone"
            prepend-inner-icon="mdi-phone"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" cols="12">
          <v-text-field
            label="Ubicación"
            required
            v-model="vet_information.veterinarian_ubication"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>
    <v-col xs="12" sm="12" md="3" cols="12">
      <v-row>
        <v-col xs="12" sm="12" cols="12">
          <!-- Rabia -->
          <v-dialog
            ref="rabia"
            v-model="modalDatePickerRabia"
            :return-value.sync="vet_information.rabies_vaccine"
            persistent
            width="290px"
            :retain-focus="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="vet_information.rabies_vaccine"
                label="V. Rabia"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :max="date"
              v-model="vet_information.rabies_vaccine"
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modalDatePickerRabia = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.rabia.save(vet_information.rabies_vaccine)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col xs="12" sm="12" cols="12">
          <!-- Penta -->
          <v-dialog
            ref="penta"
            v-model="modalDatePickerPenta"
            :return-value.sync="vet_information.pentavalent_vaccine"
            persistent
            width="290px"
            :retain-focus="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="vet_information.pentavalent_vaccine"
                label="V. Penta"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :max="date"
              v-model="vet_information.pentavalent_vaccine"
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modalDatePickerPenta = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.penta.save(vet_information.pentavalent_vaccine)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col xs="12" sm="12" cols="12">
          <!-- Tos -->
          <v-dialog
            ref="tos"
            v-model="modalDatePickerTos"
            :return-value.sync="vet_information.cough_vaccine"
            persistent
            width="290px"
            :retain-focus="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="vet_information.cough_vaccine"
                label="V. Tos"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :max="date"
              v-model="vet_information.cough_vaccine"
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modalDatePickerTos = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.tos.save(vet_information.cough_vaccine)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col xs="12" sm="12" cols="12">
          <!-- Carnet -->
          <v-file-input
            :rules="rules"
            v-model="vet_information.vaccination_card"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Carnet"
            label="Carnet"
          ></v-file-input>
        </v-col>
      </v-row>
    </v-col>
    <v-col xs="12" sm="12" md="6" cols="12">
      <v-row>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-text-field
            label="Locomoción"
            required
            v-model="vet_information.normal_locomotion"
          ></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-text-field
            label="Dorso"
            required
            v-model="vet_information.back"
          ></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-text-field
            label="Cabeza"
            required
            v-model="vet_information.head"
          ></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-text-field
            label="Vientre"
            required
            v-model="vet_information.belly"
          ></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-text-field
            label="Cuello"
            required
            v-model="vet_information.neck"
          ></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-text-field
            label="Patas Traseras"
            required
            v-model="vet_information.hind_legs"
          ></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-text-field
            label="Patas Delanteras"
            required
            v-model="vet_information.front_legs"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "pet-vet-information",
  data() {
    return {
      modalDatePickerRabia: false,
      modalDatePickerPenta: false,
      modalDatePickerTos: false,
      date: new Date().toISOString().substr(0, 10),
      rules: [
        (value) =>
          !value || value.size < 2000000 || "El carnet debe ser menos de 2 mb",
      ],
    };
  },
  computed: {
    ...mapState("pets", ["vet_information"]),
  },
};
</script>
