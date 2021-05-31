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
          comportamental
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
              <v-col cols="6">
                <v-text-field
                  label="Documento de identidad"
                  required
                  prepend-inner-icon="mdi-card-account-details-outline"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Nombres"
                  required
                  prepend-inner-icon="mdi-alphabet-latin"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Apellidos"
                  required
                  prepend-inner-icon="mdi-alphabet-latin"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
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
              <v-col cols="6">
                <v-text-field
                  label="E-mail"
                  required
                  prepend-inner-icon="mdi-email-outline"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Teléfono"
                  required
                  prepend-inner-icon="mdi-phone"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Nombre contacto de emergencia"
                  required
                  prepend-inner-icon="mdi-alphabet-latin"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Teléfono"
                  required
                  prepend-inner-icon="mdi-phone"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Nombre contacto de respaldo"
                  required
                  prepend-inner-icon="mdi-alphabet-latin"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
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
              <v-col cols="4">
                <v-row justify="center">
                  <v-avatar size="200" color="primary">
                    <v-icon size="100" dark> mdi-camera-account </v-icon>
                  </v-avatar>
                  <template v-slot:extension>
                    <v-fab-transition>
                      <v-btn
                        v-show="true"
                        color="pink"
                        fab
                        dark
                        small
                        absolute
                        bottom
                        left
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-fab-transition>
                  </template>
                </v-row>
              </v-col>
              <v-col cols="8">
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
            <v-row class="mt-5"> </v-row>
            <v-row justify="end">
              <v-btn class="mr-3" @click="step--"> volver </v-btn>
              <v-btn color="secondary" @click="step++"> Continue </v-btn>
            </v-row>
          </v-container>
        </v-stepper-content>

        <!--  -->
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      step: 4,
      meet: [{ id: 1, name: "Redes sociales" }],
    };
  },
  methods: {
    // Pendiente colocar este metodo a funcionar
    ...mapActions(["goBack"]),
  },
};
</script>
