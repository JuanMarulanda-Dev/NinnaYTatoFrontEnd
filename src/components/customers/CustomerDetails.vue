<template>
  <div>
    <!-- titel -->
    <v-row class="my-1" align="center">
      <v-btn icon @click="goBack()">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
      <h2>Perfil de cliente&nbsp;<v-icon large>mdi-paw</v-icon></h2>
    </v-row>
    <v-row>
      <v-col xs="12" sm="12" md="8" cols="12">
        <v-card>
          <v-container class="pa-6">
            <v-row justify="space-between">
              <h3>
                <v-icon>mdi-card-account-details-outline</v-icon>&nbsp;Perfil de
                cliente
              </h3>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="secondary" icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-pencil-box-multiple-outline</v-icon>
                  </v-btn>
                </template>
                <span>Editar</span>
              </v-tooltip>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
            <v-row>
              <v-col xs="12" sm="12" md="4" cols="12">
                <!-- Icon profile -->
                <v-row justify="center" align="center">
                  <v-avatar size="120" color="grey lighten-1" class="my-2 mr-1">
                    <v-icon dark x-large> mdi-account-circle </v-icon>
                  </v-avatar>
                  <!-- Nombre completo -->
                  <span>Juan David Marulanda</span>
                  <v-col cols="12">
                    <!-- Icon Genero -->
                    <v-row justify="center">
                      <span>
                        <v-icon>mdi-gender-male</v-icon>
                      </span>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
              <v-col xs="12" sm="12" md="8" cols="12">
                <v-row>
                  <!-- DNI -->
                  <v-col xs="12" sm="12" md="6" cols="12">
                    <small>DNI</small><br />
                    <label> 1216727816 </label>
                  </v-col>
                  <!-- Email -->
                  <v-col xs="12" sm="12" md="6" cols="12">
                    <small>E-mail</small><br />
                    <label> judama3012@gmail.com </label>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- Nombres -->
                  <v-col xs="12" sm="12" md="6" cols="12">
                    <small>Nombres</small><br />
                    <label> Juan David </label>
                  </v-col>
                  <!-- Apellidos -->
                  <v-col xs="12" sm="12" md="6" cols="12">
                    <small>Apellidos</small><br />
                    <label> Marulanda Paniagua </label>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- Contacto de personal -->
                  <v-col xs="12" sm="12" md="4" cols="12">
                    <small>Personal</small><br />
                    <label>
                      <v-icon>mdi-phone</v-icon>
                      2528099
                    </label>
                  </v-col>
                  <!-- Contacto de emergencia -->
                  <v-col xs="12" sm="12" md="4" cols="12">
                    <small>Emergencia</small><br />
                    <label>
                      <v-icon>mdi-phone</v-icon>
                      2528099
                    </label>
                  </v-col>
                  <!-- Contacto de respaldo -->
                  <v-col xs="12" sm="12" md="4" cols="12">
                    <small>Respaldo</small><br />
                    <label>
                      <v-icon>mdi-phone</v-icon>
                      2528099
                    </label>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col xs="12" sm="12" md="4" cols="12">
        <v-card>
          <v-container class="pa-6">
            <v-row justify="space-between">
              <h3><v-icon>mdi-paw</v-icon>&nbsp;Mascotas</h3>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="secondary" icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-plus-thick</v-icon>
                  </v-btn>
                </template>
                <span>Crear</span>
              </v-tooltip>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  methods: {
    // Pendiente colocar este metodo a funcionar
    ...mapActions(["goBack"]),
  },
};
</script>
