<template>
  <div>
    <!-- titel -->
    <v-row align="center">
      <v-btn icon @click="goBack()">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
      <h2>Perfil de cliente&nbsp;<v-icon large>mdi-account</v-icon></h2>
    </v-row>
    <v-row>
      <v-col xs="12" sm="12" md="8" cols="12">
        <v-card>
          <v-container class="pa-6">
            <v-row justify="space-between">
              <h3>
                <v-icon>mdi-card-account-details-outline</v-icon>&nbsp;Perfil de
                cliente
                <v-chip
                  v-if="personal_infomation.state"
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
              </h3>
              <v-tooltip bottom v-show="permissions.update">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="secondary"
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="goToCustomerFormUpdate()"
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
                  <v-avatar size="160" color="grey lighten-1" class="my-2 mr-1">
                    <img
                      v-if="additional_information.customer_avatar"
                      :src="additional_information.customer_avatar"
                      alt="avatar"
                    />
                    <v-icon v-else dark x-large> mdi-account-circle </v-icon>
                  </v-avatar>
                  <v-col cols="12">
                    <v-row justify="center">
                      <!-- Nombre completo -->
                      <span
                        >{{ personal_infomation.first_name }}
                        {{ personal_infomation.last_name }}</span
                      >
                      <!-- Icon Genero -->
                      <span>
                        <v-icon v-if="personal_infomation.gender == '1'">
                          mdi-gender-male
                        </v-icon>
                        <v-icon v-else>mdi-gender-female</v-icon>
                      </span>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
              <v-col xs="12" sm="12" md="8" cols="12">
                <v-row>
                  <!-- DNI -->
                  <v-col xs="12" sm="6" md="4" cols="12">
                    <small>DNI</small><br />
                    <label> {{ personal_infomation.dni }} </label>
                  </v-col>
                  <!-- Email -->
                  <v-col xs="12" sm="6" md="8" cols="12">
                    <small>E-mail</small><br />
                    <label> {{ contact_information.email }} </label>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- Nombres -->
                  <v-col xs="12" sm="6" md="6" cols="12">
                    <small>Nombres</small><br />
                    <label> {{ personal_infomation.first_name }} </label>
                  </v-col>
                  <!-- Apellidos -->
                  <v-col xs="12" sm="6" md="6" cols="12">
                    <small>Apellidos</small><br />
                    <label> {{ personal_infomation.last_name }} </label>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col xs="12" sm="6" md="4" cols="12">
                    <small>Sucursal</small><br />
                    <label> {{ personal_infomation.branch_office }} </label>
                  </v-col>
                  <!-- Creaco -->
                  <v-col xs="12" sm="6" md="4" cols="12">
                    <small>Creado</small><br />
                    <label> {{ personal_infomation.created_at }} </label>
                  </v-col>
                  <!-- Eliminado -->
                  <v-col xs="12" sm="6" md="4" cols="12">
                    <small>Eliminado</small><br />
                    <label> {{ personal_infomation.deleted_at }} </label>
                  </v-col>
                </v-row>
                <v-row>
                  <!-- Contacto de personal -->
                  <v-col xs="12" sm="6" md="4" cols="12">
                    <small>Personal</small><br />
                    <label>
                      <v-icon>mdi-phone</v-icon>
                      {{ contact_information.phone }}
                    </label>
                  </v-col>
                  <!-- Contacto de emergencia -->
                  <v-col xs="12" sm="6" md="4" cols="12">
                    <small>{{
                      contact_information.emergency_contact_name
                    }}</small
                    ><br />
                    <label>
                      <v-icon>mdi-phone</v-icon>
                      {{ contact_information.emergency_contact_phone }}
                    </label>
                  </v-col>
                  <!-- Contacto de respaldo -->
                  <v-col xs="12" sm="6" md="4" cols="12">
                    <small>{{ contact_information.backup_contact_name }}</small
                    ><br />
                    <label>
                      <v-icon>mdi-phone</v-icon>
                      {{ contact_information.backup_contact_phone }}
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
              <v-tooltip bottom v-show="permissions.create">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="secondary"
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="goToPetFormCreate()"
                  >
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
                <v-simple-table height="265px">
                  <template v-slot:default>
                    <tbody>
                      <tr v-for="item in pets" :key="item.id">
                        <td class="pa-0 cursor" @click="goToShowPet(item.id)">
                          <div class="d-flex pa-1">
                            <v-badge
                              bordered
                              bottom
                              :color="item.state ? 'success' : 'error'"
                              dot
                              offset-x="20"
                              offset-y="10"
                            >
                              <v-avatar class="mr-2" color="primary">
                                <img
                                  v-if="item.avatar"
                                  :src="item.avatar"
                                  alt="avatar"
                                />
                                <v-icon v-else dark> mdi-dog-side </v-icon>
                              </v-avatar>
                            </v-badge>

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
                              <small>{{ item.breed }} - {{ item.age }}</small>
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
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      customerId: null,
    };
  },
  computed: {
    ...mapState("customers", [
      "personal_infomation",
      "contact_information",
      "additional_information",
      "pets",
      "permissions",
    ]),
  },
  created() {
    //take id customer details
    this.customerId = this.$route.params.customer;
    this.getDetailsCustomer(this.customerId);
  },
  methods: {
    goBack() {
      this.$router.push({
        path: `/clientes`,
      });
    },
    ...mapActions("customers", ["getDetailsCustomer"]),
    goToShowPet(petId) {
      this.$router.push({
        path: `${this.customerId}/mascota/${petId}`,
      });
    },
    goToCustomerFormUpdate() {
      this.$router.push({
        path: `${this.customerId}/editar`,
      });
    },
    goToPetFormCreate() {
      this.$router.push({
        path: `${this.customerId}/mascota`,
      });
    },
  },
};
</script>
