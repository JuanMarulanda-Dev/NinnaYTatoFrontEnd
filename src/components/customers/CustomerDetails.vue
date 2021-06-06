<template>
  <div>
    <!-- titel -->
    <v-row align="center">
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
                  <v-avatar size="160" color="grey lighten-1" class="my-2 mr-1">
                    <v-icon dark x-large> mdi-account-circle </v-icon>
                  </v-avatar>
                  <v-col cols="12">
                    <v-row justify="center">
                      <!-- Nombre completo -->
                      <span>Juan David Marulanda</span>
                      <!-- Icon Genero -->
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
                  <v-col xs="12" sm="6" md="6" cols="12">
                    <small>DNI</small><br />
                    <label> 1216727816 </label>
                  </v-col>
                  <!-- Email -->
                  <v-col xs="12" sm="6" md="6" cols="12">
                    <small>E-mail</small><br />
                    <label> judama3012@gmail.com </label>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- Nombres -->
                  <v-col xs="12" sm="6" md="6" cols="12">
                    <small>Nombres</small><br />
                    <label> Juan David </label>
                  </v-col>
                  <!-- Apellidos -->
                  <v-col xs="12" sm="6" md="6" cols="12">
                    <small>Apellidos</small><br />
                    <label> Marulanda Paniagua </label>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- Contacto de personal -->
                  <v-col xs="12" sm="6" md="4" cols="12">
                    <small>Personal</small><br />
                    <label>
                      <v-icon>mdi-phone</v-icon>
                      2528099
                    </label>
                  </v-col>
                  <!-- Contacto de emergencia -->
                  <v-col xs="12" sm="6" md="4" cols="12">
                    <small>Emergencia</small><br />
                    <label>
                      <v-icon>mdi-phone</v-icon>
                      2528099
                    </label>
                  </v-col>
                  <!-- Contacto de respaldo -->
                  <v-col xs="12" sm="6" md="4" cols="12">
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
            <v-row>
              <v-col cols="12">
                <v-simple-table height="193px">
                  <template v-slot:default>
                    <tbody>
                      <tr v-for="item in pets" :key="item.id">
                        <td class="pa-0 cursor" @click="goToShowPet(item.id)">
                          <div class="d-flex pa-1">
                            <v-avatar class="mr-2" color="primary"></v-avatar>
                            <div>
                              <label>
                                {{ item.name }}&nbsp;
                                <v-icon v-if="item.gender" x-small
                                  >mdi-gender-male</v-icon
                                >
                                <v-icon v-else x-small
                                  >mdi-gender-female</v-icon
                                >
                              </label>
                              <br />
                              <small>{{ item.race }} - {{ item.age }}</small>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
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
    return {
      customerId: null,
      pets: [
        {
          id: 1,
          name: "Frozen Yogurt",
          gender: 0,
          race: "Jack Terrier",
          age: "1 año/s y 7 mes/es",
        },
        {
          id: 2,
          name: "Frozen Yogurt",
          gender: 1,
          race: "Jack Terrier",
          age: "1 año/s y 7 mes/es",
        },
      ],
    };
  },
  created() {
    //take id customer details
    this.customerId = this.$route.params.customer;
  },
  methods: {
    ...mapActions(["goBack"]),
    goToShowPet(petId) {
      this.$router.push({
        path: `${this.customerId}/mascota/${petId}`,
      });
    },
  },
};
</script>
