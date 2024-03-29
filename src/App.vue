<template>
  <div id="app">
    <!-- Scren Loading -->
    <v-overlay :value="loadingOverlay" z-index="10000" opacity="0.62">
      <pawLoading></pawLoading>
    </v-overlay>
    <!-- Dashboard (Home) -->
    <template v-if="!$route.meta.guest">
      <v-app>
        <v-main>
          <!-- Menu navigation -->
          <v-navigation-drawer v-model="drawer" app>
            <!-- Header Sidebar -->
            <v-list class="text-center pb-0">
              <!-- Logo -->
              <v-list-item>
                <v-img src="@/assets/logo.png">
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row> </template
                ></v-img>
              </v-list-item>
              <!-- User logging -->
              <v-list-item link>
                <v-list-item-content>
                  <v-list-item-title class="title">
                    {{ user.first_name }} {{ user.last_name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ user.email }} </v-list-item-subtitle>
                  <!-- Role is different to Admin?-->
                  <v-list-item-subtitle v-if="!user.is_admin">
                    <v-icon>mdi-home-circle-outline</v-icon>
                    {{ user.branch_office }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <!-- Select branch offices -->
              <v-list-item dense v-if="user.is_admin">
                <v-select
                  class="text-center"
                  v-model="mainBranchOffice"
                  :items="branch_offices"
                  prepend-inner-icon="mdi-home-circle-outline"
                  item-text="name"
                  item-value="id"
                  label="Sucursal"
                  dense
                ></v-select>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <!-- Menu options -->
            <v-list nav dense shaped>
              <v-list-item-group color="secondary">
                <div v-for="(option, i) in menu" :key="i">
                  <!-- Multiple option -->
                  <v-list-group
                    v-if="option.items"
                    :key="i"
                    :prepend-icon="option.icon"
                    no-action
                    color="secondary"
                  >
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="option.text"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </template>

                    <v-list-item
                      v-for="(subItem, j) in option.items"
                      :key="j"
                      router
                      :to="subItem.to"
                    >
                      <v-list-item-title
                        v-text="subItem.text"
                      ></v-list-item-title>
                      <v-list-item-icon>
                        <v-icon v-text="subItem.icon"></v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                  </v-list-group>

                  <!-- One Element -->
                  <v-list-item v-else :key="i" router :to="option.to">
                    <v-list-item-icon>
                      <v-icon v-text="option.icon"></v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title
                        v-text="option.text"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </div>
              </v-list-item-group>
            </v-list>
          </v-navigation-drawer>

          <!-- App bar -->
          <v-app-bar app color="secondary" dark>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-toolbar-title></v-toolbar-title>

            <v-spacer></v-spacer>

            <!-- Notifications -->
            <notifications :show="true" />
            <!-- Logout -->
            <v-dialog v-model="logoutModal" persistent max-width="300">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-power-standby</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline">¿Seguro seguro?</v-card-title>
                <v-card-text>Se saldra del sistema...</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="gray darken-1" text @click="logoutModal = false"
                    >Cancelar</v-btn
                  >
                  <v-btn color="red darken-1" text @click="logoutAction"
                    >Salir</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-app-bar>

          <!-- Content -->
          <v-container transition="slide-x-transition" fluid class="pb-10 pa-5">
            <transition mode="out-in" name="slide-fade">
              <router-view></router-view>
            </transition>
          </v-container>

          <!-- Footer -->
          <v-footer
            color="primary"
            fixed
            elevation="6"
            padless
            class="text-center"
          >
            <v-card-text class="pa-0">
              <small> &copy; {{ new Date().getFullYear() }}</small
              >&nbsp;-&nbsp;
              <small
                >Desarrollado con &hearts; por
                <a
                  href="https://www.instagram.com/jdmarulanda12/"
                  target="_blank"
                  >Juan David M</a
                >
                y
                <a href="https://www.instagram.com/jcml1999/" target="_blank"
                  >Juan Muñoz L</a
                >
              </small>
            </v-card-text>
          </v-footer>
        </v-main>
      </v-app>

      <!-- Terms and conditions -->
      <terms-and-conditions-dialog></terms-and-conditions-dialog>
    </template>

    <!-- Login page-->
    <template v-else>
      <transition name="fade">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import pawLoading from "@/components/pawLoading.vue";
import TermsAndConditionsDialog from "@/components/TermsAndConditionsDialog.vue";
import notifications from "@/components/notifications.vue";

export default {
  name: "App",
  data: () => ({
    drawer: null,
    logoutModal: false,
  }),
  created() {
    // Validar si existe la info del usuario
    if (Object.keys(this.user).length === 0) {
      this.getUserLocalStorage();
    }
    // Validar si existe la info del menu
    if (this.menu.length == 0) {
      this.getMenuLocalStorage();
    }

    // Hacer estas consultas solo si exciste la cookie de autentificación
    if (this.user.id) {
      this.getNotificationsByUser(this.user.id);
    }

    if (this.user.is_admin) {
      this.getAllBranchOffices();
    }

    this.registerServiceWorker();

    // Event to push notification
    navigator.serviceWorker.addEventListener("message", (event) => {
      console.log(event.data);
      this.notifications.push(event.data);
      // Pending
    });
  },
  computed: {
    ...mapState(["user", "menu", "loadingOverlay"]),
    ...mapState("branch_offices", ["branch_offices"]),

    mainBranchOffice: {
      get() {
        return this.$store.state.mainBranchOffice;
      },
      set(value) {
        this.$store.commit("SET_MAIN_BRANCH_OFFICE", value);
      },
    },
  },
  methods: {
    ...mapActions([
      "getUserLocalStorage",
      "getMenuLocalStorage",
      "getUser",
      "getMenu",
      "logout",
    ]),
    ...mapActions("branch_offices", ["getAllBranchOffices"]),
    ...mapActions("notifications", ["getNotificationsByUser"]),

    async logoutAction() {
      // Ejecutar el cerrar session
      let result = await this.logout();
      if (result) {
        // Eliminar la cookies de al aplicación
        this.deleteAllCookies();
        // Eliminar la info del local storage
        localStorage.clear();
        // Redireccionar al login
        this.$router.push({ name: "Login" });
      }

      this.logoutModal = false;
    },
  },
  components: {
    pawLoading,
    notifications,
    TermsAndConditionsDialog,
  },
};
</script>

<style>
.cursor {
  cursor: pointer;
}
</style>
