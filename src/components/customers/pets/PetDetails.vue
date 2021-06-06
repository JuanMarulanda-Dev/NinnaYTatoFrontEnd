<template>
  <div>
    <!-- titel -->
    <v-row align="center">
      <v-btn icon @click="goBack()">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
      <h2>Perfil de mascota&nbsp;<v-icon large>mdi-paw</v-icon></h2>
    </v-row>
    <v-row>
      <!-- Info general -->
      <v-col xs="12" sm="12" md="8" cols="12">
        <v-card class="default">
          <v-container class="pa-6">
            <v-row justify="space-between">
              <h3><v-icon>mdi-paw</v-icon>&nbsp;Perfil de mascota</h3>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="secondary"
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="goToEditPetForm()"
                  >
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
                  <v-avatar
                    tile
                    size="160"
                    color="grey lighten-1"
                    class="my-2 mr-1"
                  >
                    <v-icon dark x-large> mdi-dog-side </v-icon>
                  </v-avatar>
                  <v-col cols="12">
                    <v-row justify="center">
                      <!-- Nombre de la mascota -->
                      <span>Nicolas</span>
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
                  <!-- Raza -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Raza</small><br />
                    <label> Jack Terrier </label>
                  </v-col>
                  <!-- Fecha de nacimiento -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Nacimiento</small><br />
                    <label> 20-05-2021 </label>
                  </v-col>
                  <!-- Fecha de nacimiento -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Edad</small><br />
                    <label> 1 año/s y 7 mes/es </label>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- Numero de Chip -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Chip</small><br />
                    <label> 1254265452 </label>
                  </v-col>
                  <!-- Pelaje -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Pelaje</small><br />
                    <label> Largo </label>
                  </v-col>
                  <!-- Tamaño -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Tamaño</small><br />
                    <label> Grande </label>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- Alimento -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Alimento</small><br />
                    <label> Pedigree </label>
                  </v-col>
                  <!-- Esterilización -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Esterilización </small><br />
                    <label> Si </label>
                  </v-col>
                  <!-- ¿Monta? -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Monta</small><br />
                    <label> No </label>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- Instrucciones generales -->
                  <v-col cols="12">
                    <small>Instrucciones generales</small><br />
                    <label>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolor nobis, est, sequi ex culpa nihil vero natus harum
                      maiores corrupti sed consectetur, nesciunt deserunt
                      laborum quisquam quas doloribus quaerat nisi.
                    </label>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <!-- Info comportamental -->
      <v-col xs="12" sm="12" md="4" cols="12">
        <v-card class="default">
          <v-container class="pa-6">
            <v-row>
              <h3>
                <v-icon>mdi-alarm-light-outline</v-icon>&nbsp;Comportamiento
              </h3>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
            <v-row>
              <v-col xs="12" sm="4" md="12" cols="12" class="pb-0">
                <small>Socialización</small><br />
                <v-rating
                  dense
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating>
              </v-col>
              <v-col xs="12" sm="4" md="12" cols="12" class="pb-0">
                <small>Temperamento</small><br />
                <v-rating
                  dense
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating>
              </v-col>
              <v-col xs="12" sm="4" md="12" cols="12" class="pb-0">
                <small>Energia</small><br />
                <v-rating
                  dense
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating>
              </v-col>
              <v-col xs="12" sm="4" md="12" cols="12" class="pb-0">
                <small>Ansiedad</small><br />
                <v-rating
                  dense
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating>
              </v-col>
              <v-col xs="12" sm="4" md="12" cols="12" class="pb-0">
                <small>Ladrido</small><br />
                <v-rating
                  dense
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating>
              </v-col>
              <v-col xs="12" sm="4" md="12" cols="12" class="pb-0">
                <small>Agresividad</small><br />
                <v-rating
                  dense
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <!-- Info veterinaria -->
      <v-col xs="12" sm="12" md="12" cols="12">
        <v-card>
          <v-container class="pa-6">
            <v-row>
              <h3><v-icon>mdi-file-document</v-icon>&nbsp;Info Veterinaria</h3>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
            <v-row>
              <!-- Veterinario de confianza -->
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Veterinario</small><br />
                <label> Pepito perez</label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Teléfono</small><br />
                <label> 3004991084</label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Ubicación</small><br />
                <label> Cll 48CC #120e 117</label>
              </v-col>
              <!-- Vacunas -->
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>V. Rabia</small><br />
                <label>20/05/2019</label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>V. Penta</small><br />
                <label>20/05/2019</label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>V. Tos</small><br />
                <label>20/05/2019</label>
              </v-col>
              <!-- Estado general -->
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Locomoción</small><br />
                <label></label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Dorso</small><br />
                <label></label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Cabeza</small><br />
                <label></label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Vientre</small><br />
                <label></label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Cuello</small><br />
                <label></label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Patas traseras</small><br />
                <label></label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Patas delanteras</small><br />
                <label></label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Carnet</small><br />
                <v-btn small color="info">
                  ver
                  <v-icon>mdi-eye-outline</v-icon>
                </v-btn>
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
      petId: null,
    };
  },
  created() {
    //take id customer details
    this.customerId = this.$route.params.customer;
    this.petId = this.$route.params.pet;
  },
  methods: {
    ...mapActions(["goBack"]),
    goToEditPetForm() {
      this.$router.push({
        path: `${this.petId}/editar`,
      });
    },
  },
};
</script>

<style scoped>
@media (min-width: 960px) {
  .default {
    min-height: 70vh;
  }
}
</style>
