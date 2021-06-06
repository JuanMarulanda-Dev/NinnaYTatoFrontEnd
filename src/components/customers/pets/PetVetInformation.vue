<template>
  <v-row class="mt-5">
    <v-col xs="12" sm="12" md="3" cols="12">
      <v-row>
        <v-col xs="12" sm="12" cols="12">
          <v-text-field
            label="Veterinario de confianza"
            required
            prepend-inner-icon="mdi-card-account-details-outline"
          ></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" cols="12">
          <v-text-field
            label="Teléfono"
            required
            prepend-inner-icon="mdi-phone"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" cols="12">
          <v-text-field label="Ubicación" required></v-text-field>
        </v-col>
      </v-row>
    </v-col>
    <v-col xs="12" sm="12" md="3" cols="12">
      <v-row>
        <v-col xs="12" sm="12" cols="12">
          <!-- Rabia -->
          <v-dialog
            ref="dialog"
            v-model="modalDatePicker"
            :return-value.sync="date"
            persistent
            width="290px"
            :retain-focus="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="V. Rabia"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modalDatePicker = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col xs="12" sm="12" cols="12">
          <!-- Penta -->
          <v-dialog
            ref="dialog"
            v-model="modalDatePicker"
            :return-value.sync="date"
            persistent
            width="290px"
            :retain-focus="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="V. Penta"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modalDatePicker = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col xs="12" sm="12" cols="12">
          <!-- Tos -->
          <v-dialog
            ref="dialog"
            v-model="modalDatePicker"
            :return-value.sync="date"
            persistent
            width="290px"
            :retain-focus="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="V. Tos"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modalDatePicker = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col xs="12" sm="12" cols="12">
          <!-- Carnet -->
          <v-file-input
            :rules="rules"
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
          <v-text-field label="Locomoción" required></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-text-field label="Dorso" required></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-text-field label="Cabeza" required></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-text-field label="Vientre" required></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-text-field label="Cuello" required></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-text-field label="Patas Traseras" required></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" md="6" cols="12">
          <v-text-field label="Patas Delanteras" required></v-text-field>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "pet-vet-information",
  data() {
    return {
      modalDatePicker: false,
      date: new Date().toISOString().substr(0, 10),
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!",
      ],
    };
  },
};
</script>
