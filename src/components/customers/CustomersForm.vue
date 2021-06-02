<template>
  <div>
    <!-- titel -->
    <v-row class="my-1" align="center">
      <v-btn icon @click="goBack()">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
      <h2>Formulario de clientes&nbsp;<v-icon large>mdi-paw</v-icon></h2>
    </v-row>

    <v-stepper alt-labels v-model="step">
      <v-stepper-header>
        <v-stepper-step color="secondary" :complete="step > 1" step="1">
          Info personal
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="secondary" :complete="step > 2" step="2">
          Info de contacto
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="secondary" :complete="step > 3" step="3">
          Datos adicionales
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="secondary" :complete="step > 4" step="4">
          Mascota
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="secondary" :complete="step > 5" step="5">
          Info veterinaria
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step color="secondary" :complete="step > 6" step="6">
          Comportamental
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <!-- Info Personal -->
        <v-stepper-content step="1">
          <v-container>
            <v-row justify="center">
              <h4 color="secondary">Información Personal</h4>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
            <v-row>
              <v-col xs="12" sm="12" md="6" cols="12">
                <v-text-field
                  label="Documento de identidad"
                  required
                  prepend-inner-icon="mdi-card-account-details-outline"
                ></v-text-field>
              </v-col>
              <v-col xs="12" sm="12" md="6" cols="12">
                <v-text-field
                  label="Nombres"
                  required
                  prepend-inner-icon="mdi-alphabet-latin"
                ></v-text-field>
              </v-col>
              <v-col xs="12" sm="12" md="6" cols="12">
                <v-text-field
                  label="Apellidos"
                  required
                  prepend-inner-icon="mdi-alphabet-latin"
                ></v-text-field>
              </v-col>
              <v-col xs="12" sm="12" md="6" cols="12">
                <v-radio-group row>
                  <v-radio
                    color="secondary"
                    on-icon="mdi-gender-female"
                    label="Femenino"
                    value="0"
                  ></v-radio>
                  <v-radio
                    color="secondary"
                    on-icon="mdi-gender-male"
                    label="Masculino"
                    value="1"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-btn color="secondary" @click="step = 2"> Continue </v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>

        <!-- Información de contacto -->
        <v-stepper-content step="2">
          <v-container>
            <v-row justify="center">
              <h4 color="secondary">Información de contacto</h4>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
            <v-row>
              <v-col xs="12" sm="12" md="6" cols="12">
                <v-text-field
                  label="E-mail"
                  required
                  prepend-inner-icon="mdi-email-outline"
                ></v-text-field>
              </v-col>
              <v-col xs="12" sm="12" md="6" cols="12">
                <v-text-field
                  label="Teléfono"
                  required
                  prepend-inner-icon="mdi-phone"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col xs="12" sm="12" md="6" cols="12">
                <v-text-field
                  label="Nombre contacto de emergencia"
                  required
                  prepend-inner-icon="mdi-alphabet-latin"
                ></v-text-field>
              </v-col>
              <v-col xs="12" sm="12" md="6" cols="12">
                <v-text-field
                  label="Teléfono"
                  required
                  prepend-inner-icon="mdi-phone"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col xs="12" sm="12" md="6" cols="12">
                <v-text-field
                  label="Nombre contacto de respaldo"
                  required
                  prepend-inner-icon="mdi-alphabet-latin"
                ></v-text-field>
              </v-col>
              <v-col xs="12" sm="12" md="6" cols="12">
                <v-text-field
                  label="Teléfono"
                  required
                  prepend-inner-icon="mdi-phone"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-btn class="mr-3" @click="step--"> volver </v-btn>
              <v-btn color="secondary" @click="step++"> Continue </v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>

        <!-- Datos adicionales -->
        <v-stepper-content step="3">
          <v-container>
            <v-row justify="center">
              <h4 color="secondary">Datos Adicionales</h4>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
            <v-row class="mt-5">
              <v-col xs="12" sm="12" md="4" cols="12">
                <v-row justify="center">
                  <image-input v-model="userImage">
                    <div slot="activator">
                      <v-avatar
                        size="200px"
                        v-ripple
                        v-if="!userImage"
                        class="grey lighten-3 mb-3"
                      >
                        <span>Click para añadir</span>
                      </v-avatar>
                      <v-avatar size="200px" v-ripple v-else class="mb-3">
                        <img :src="userImage.imageURL" alt="avatar" />
                      </v-avatar>
                    </div>
                  </image-input>
                </v-row>
              </v-col>
              <v-col xs="12" sm="12" md="8" cols="12">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Red social"
                      required
                      prepend-inner-icon="mdi-instagram"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="meet"
                      item-text="name"
                      item-value="id"
                      label="¿Como nos conoció?"
                      dense
                      prepend-icon="mdi-account-supervisor-circle"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-btn class="mr-3" @click="step--"> volver </v-btn>
              <v-btn color="secondary" @click="step++"> Continue </v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>

        <!-- Registrar mascota -->
        <v-stepper-content step="4">
          <v-container>
            <v-row justify="center">
              <h4 color="secondary">Registrar Mascota</h4>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
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
                      prepend-icon="mdi-dog"
                    ></v-select>
                  </v-col>
                  <!-- Gender -->
                  <v-col cols="12">
                    <v-row justify="center">
                      <v-radio-group row>
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
                  <v-switch label="Esterilización"></v-switch>
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
                          prepend-inner-icon="mdi-alphabet-latin"
                        ></v-text-field>
                      </v-col>
                      <v-col xs="12" sm="12" md="6" cols="12">
                        <!-- Fecha de nacimiento -->
                        <v-dialog
                          ref="dialog"
                          v-model="modalDatePicker"
                          :return-value.sync="date"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="date"
                              label="Fecha de nacimiento"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="date" scrollable>
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
                              @click="$refs.dialog.save(date)"
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
                          prepend-inner-icon="mdi-memory"
                        ></v-text-field>
                      </v-col>
                      <v-col xs="12" sm="12" md="6" cols="12">
                        <v-select
                          :items="races"
                          item-text="name"
                          item-value="id"
                          label="Pelaje"
                        ></v-select>
                      </v-col>
                      <v-col xs="12" sm="12" md="6" cols="12">
                        <v-select
                          :items="races"
                          item-text="name"
                          item-value="id"
                          label="Pelaje"
                        ></v-select
                      ></v-col>
                      <v-col xs="12" sm="12" md="6" cols="12">
                        <v-select
                          :items="races"
                          item-text="name"
                          item-value="id"
                          label="Pelaje"
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
                      name="input-7-4"
                      label="Instrucciones Generales"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- back - next -->
            <v-row justify="end">
              <v-btn class="mr-3" @click="step--"> volver </v-btn>
              <v-btn color="secondary" @click="step++"> Continue </v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>

        <!-- Info Veterinaria -->
        <v-stepper-content step="5">
          <v-container>
            <v-row justify="center">
              <h4 color="secondary">Información Veterinaria</h4>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
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
                          @click="$refs.dialog.save(date)"
                        >
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
                          @click="$refs.dialog.save(date)"
                        >
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
                          @click="$refs.dialog.save(date)"
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
                    <v-text-field
                      label="Patas Traseras"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col xs="12" sm="12" md="6" cols="12">
                    <v-text-field
                      label="Patas Delanteras"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- back - next -->
            <v-row justify="end">
              <v-btn class="mr-3" @click="step--"> volver </v-btn>
              <v-btn color="secondary" @click="step++"> Continue </v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>

        <!-- Comportamental -->
        <v-stepper-content step="6">
          <v-container>
            <v-row justify="center">
              <h4 color="secondary">Información Comportamental</h4>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
            <v-row class="mt-5">
              <v-col xs="12" sm="6" md="3" cols="12">
                <label>Socialización</label>
                <v-rating
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating>
              </v-col>
              <v-col xs="12" sm="6" md="3" cols="12"
                ><label>Temperamento</label>
                <v-rating
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating
              ></v-col>
              <v-col xs="12" sm="6" md="3" cols="12"
                ><label>Energia</label>
                <v-rating
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating
              ></v-col>
              <v-col xs="12" sm="6" md="3" cols="12"
                ><label>Ansiedad</label>
                <v-rating
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating
              ></v-col>
              <v-col xs="12" sm="6" md="3" cols="12"
                ><label>Ladrido</label>
                <v-rating
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating
              ></v-col>
              <v-col xs="12" sm="6" md="3" cols="12"
                ><label>Agresividad</label>
                <v-rating
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating
              ></v-col>
              <v-col xs="12" sm="6" md="3" cols="12">
                <label>Monta</label>
                <v-switch></v-switch>
              </v-col>
            </v-row>
            <!-- back - next -->
            <v-row justify="end">
              <v-btn class="mr-3" @click="step--"> volver </v-btn>
              <v-btn color="secondary"> Finalizar </v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ImageInput from "@/components/imageUploader.vue";

export default {
  data() {
    return {
      step: 1,
      modalDatePicker: false,
      userImage: null,
      petImage: null,
      meet: [{ id: 1, name: "Redes sociales" }],
      races: [{ id: 1, name: "Chanda" }],
      date: new Date().toISOString().substr(0, 10),
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!",
      ],
    };
  },
  components: {
    ImageInput,
  },
  methods: {
    // Pendiente colocar este metodo a funcionar
    ...mapActions(["goBack"]),
  },
};
</script>

<style scoped>
@media (max-width: 320px) {
  .v-stepper--alt-labels .v-stepper__step {
    flex-basis: 157px !important;
  }
}
@media (min-width: 375px) {
  .v-stepper--alt-labels .v-stepper__step {
    flex-basis: 167px !important;
  }
}
</style>
