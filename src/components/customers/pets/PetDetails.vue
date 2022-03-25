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
              <h3>
                <v-icon>mdi-paw</v-icon>&nbsp;Perfil de mascota
                <v-chip
                  v-if="pet.state"
                  small
                  class="ma-2"
                  color="green"
                  text-color="white"
                >
                  Activo
                </v-chip>
                <v-chip
                  v-else
                  small
                  class="ma-2"
                  color="red"
                  text-color="white"
                >
                  Inactivo
                </v-chip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <small
                      class="font-weight-light"
                      v-bind="attrs"
                      v-on="on"
                      v-show="pet.pet_days_last_lodging > 0"
                    >
                      ({{ pet.pet_days_last_lodging }})
                    </small>
                  </template>
                  <span>Días que a dejado de asistir</span>
                </v-tooltip>
              </h3>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="secondary"
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="goToEditPetForm()"
                    v-show="permissions.update || !user.is_customer"
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
                    <img
                      v-if="pet.pet_avatar"
                      :src="pet.pet_avatar"
                      alt="avatar"
                    />
                    <v-icon v-else dark x-large> mdi-dog-side </v-icon>
                  </v-avatar>
                  <v-col cols="12">
                    <v-row justify="center">
                      <!-- Nombre de la mascota -->
                      <span>{{ pet.pet_name }}</span>
                      <!-- Icon Genero -->
                      <span> <v-icon>mdi-gender-male</v-icon> </span>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <v-row justify="center">
                      <!-- State -->
                      <v-switch
                        :input-value="pet.state"
                        v-model="pet.state"
                        @change="changePetState()"
                        v-show="permissions.delete"
                      ></v-switch>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
              <v-col xs="12" sm="12" md="8" cols="12">
                <v-row>
                  <!-- Raza -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Raza</small><br />
                    <label> {{ pet.pet_breed }} </label>
                  </v-col>
                  <!-- Fecha de nacimiento -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Nacimiento</small><br />
                    <label> {{ pet.pet_birth_date }} </label>
                  </v-col>
                  <!-- Fecha de nacimiento -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Edad</small><br />
                    <label> {{ pet.pet_age }} </label>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- Numero de Chip -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Chip</small><br />
                    <label> {{ formattValue(pet.pet_chip_number) }} </label>
                  </v-col>
                  <!-- Pelaje -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Pelaje</small><br />
                    <label> {{ pet.pet_fur }} </label>
                  </v-col>
                  <!-- Tamaño -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Tamaño</small><br />
                    <label> {{ pet.pet_size }} </label>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- Alimento -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Alimento</small><br />
                    <label> {{ pet.pet_food }} </label>
                  </v-col>
                  <!-- Esterilización -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Esterilización </small><br />
                    <label>
                      {{ pet.pet_sterilized == "1" ? "SI" : "No" }}
                    </label>
                  </v-col>
                  <!-- ¿Monta? -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Monta</small><br />
                    <label> {{ pet_behavior.ride ? "SI" : "No" }} </label>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- Creado -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Creado</small><br />
                    <label> {{ pet.created_at }} </label>
                  </v-col>
                  <!-- Eliminado -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Eliminado </small><br />
                    <label> {{ formattValue(pet.deleted_at) }} </label>
                  </v-col>
                  <!-- Dueño -->
                  <v-col xs="12" sm="4" md="4" cols="12">
                    <small>Dueño </small><br />
                    <v-avatar color="grey lighten-1">
                      <img
                        v-if="pet.customer_avatar"
                        :src="pet.customer_avatar"
                        :alt="pet.customer_name"
                      />
                      <v-icon v-else dark> mdi-account-circle </v-icon>
                    </v-avatar>
                    <br />
                    <label> {{ pet.customer_name }} </label>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- Instrucciones generales -->
                  <v-col cols="12">
                    <small>Instrucciones generales</small><br />
                    <label>
                      {{ formattValue(pet.pet_general_instructions) }}
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
                  v-model="pet_behavior.socialization"
                  readonly
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating>
              </v-col>
              <v-col xs="12" sm="4" md="12" cols="12" class="pb-0">
                <small>Temperamento</small><br />
                <v-rating
                  dense
                  v-model="pet_behavior.general_temperament"
                  readonly
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating>
              </v-col>
              <v-col xs="12" sm="4" md="12" cols="12" class="pb-0">
                <small>Energia</small><br />
                <v-rating
                  dense
                  v-model="pet_behavior.energy"
                  readonly
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating>
              </v-col>
              <v-col xs="12" sm="4" md="12" cols="12" class="pb-0">
                <small>Ansiedad</small><br />
                <v-rating
                  dense
                  v-model="pet_behavior.anxiety"
                  readonly
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating>
              </v-col>
              <v-col xs="12" sm="4" md="12" cols="12" class="pb-0">
                <small>Ladrido</small><br />
                <v-rating
                  dense
                  v-model="pet_behavior.bark"
                  readonly
                  half-increments
                  background-color="indigo lighten-3"
                  color="indigo"
                ></v-rating>
              </v-col>
              <v-col xs="12" sm="4" md="12" cols="12" class="pb-0">
                <small>Agresividad</small><br />
                <v-rating
                  dense
                  v-model="pet_behavior.aggressiveness"
                  readonly
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
                <label> {{ vet_information.veterinarian_name }} </label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Teléfono</small><br />
                <label> {{ vet_information.veterinarian_phone }}</label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Ubicación</small><br />
                <label> {{ vet_information.veterinarian_ubication }}</label>
              </v-col>
              <!-- Vacunas -->
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>V. Rabia</small><br />
                <label>{{ vet_information.rabies_vaccine }}</label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>V. Penta</small><br />
                <label>{{ vet_information.pentavalent_vaccine }}</label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>V. Tos</small><br />
                <label>{{ vet_information.cough_vaccine }}</label>
              </v-col>
              <!-- Estado general -->
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Locomoción</small><br />
                <label>
                  {{ formattValue(vet_information.normal_locomotion) }}
                </label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Dorso</small><br />
                <label>{{ formattValue(vet_information.back) }}</label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Cabeza</small><br />
                <label>{{ formattValue(vet_information.head) }}</label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Vientre</small><br />
                <label>{{ formattValue(vet_information.belly) }}</label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Cuello</small><br />
                <label>{{ formattValue(vet_information.neck) }}</label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Patas traseras</small><br />
                <label>{{ formattValue(vet_information.hind_legs) }}</label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Patas delanteras</small><br />
                <label>{{ formattValue(vet_information.front_legs) }}</label>
              </v-col>
              <v-col xs="12" sm="4" md="4" cols="12" class="pb-0">
                <small>Carnet</small><br />
                <v-btn
                  v-show="vet_information.url_vaccination_card != null"
                  small
                  color="info"
                  @click="showCarnet()"
                >
                  ver
                  <v-icon>mdi-eye-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <!-- Lodgings -->
      <v-col cols="12">
        <lodging-data-table v-model="pet_lodgings" :headers="headers">
          <!-- Datatable history lodging-->
          <template v-slot:header>
            <v-toolbar flat color="white" class="rounded-xl">
              <v-toolbar-title>
                <h4><v-icon>mdi-paw</v-icon>&nbsp;Alojamientos en guarderia</h4>
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
            </v-toolbar>
          </template>
        </lodging-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import LodgingDataTable from "@/components/lodging/LodgingDataTable.vue";

export default {
  data() {
    return {
      petId: null,
      headers: [
        { text: "Ingreso", align: "center", value: "arrival_date" },
        { text: "Salida", align: "center", value: "departure_date" },
        { text: "Horas", align: "center", value: "departure_data.hours" },
        {
          text: "Nombre del plan",
          align: "center",
          value: "departure_data.plan_name",
        },
        {
          text: "Acciones",
          align: "center",
          value: "actions",
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState("pets", [
      "pet",
      "vet_information",
      "pet_behavior",
      "pet_lodgings",
    ]),
    ...mapState(["user"]),
    ...mapState("customers", ["personal_infomation", "permissions"]),
  },
  methods: {
    goBack() {
      this.$router.push({
        path: `/clientes/detalles/${this.$route.params.customer}`,
      });
    },
    ...mapActions("pets", ["getDetailsPet", "changeStatusPet"]),
    ...mapMutations("pets", ["SET_PET_DEFAULT"]),
    ...mapMutations("customers", ["SET_PERMISSIONS"]),

    goToEditPetForm() {
      this.$router.push({
        path: `${this.petId}/editar`,
      });
    },
    changePetState() {
      // Confirmation to change de status
      this.$confirm("¿Quieres cambiar el estado de esta mascota?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Make to change status to backend
          this.changeStatusPet().then((result) => {
            if (!result) {
              // Rollback the state from branch office
              this.rollbackPet();
            }
          });
        } else {
          // Rollback the state from branch office
          this.rollbackPet();
        }
      });
    },
    rollbackPet() {
      let state = !this.pet.state;
      this.pet.state = state;
    },
    showCarnet() {
      window.open(this.vet_information.url_vaccination_card, "_blank");
    },
    formattValue(value) {
      return value ?? "-";
    },
  },
  created() {
    if (Object.keys(this.permissions).length === 0) {
      // Obtener los permisos
      this.SET_PERMISSIONS(this.$route.meta.permissions);
    }
    //take id customer details
    if (this.personal_infomation.id == 0) {
      this.$router.push({
        path: `/clientes/detalles/${this.$route.params.customer}`,
      });
    } else {
      this.petId = this.$route.params.pet;
      this.getDetailsPet(this.petId);
    }
  },
  components: {
    LodgingDataTable,
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
