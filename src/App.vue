<template>
  <div id="app">
    <!-- Scren Loading -->
    <v-overlay :value="loadingOverlay" z-index="10000" opacity="0.62">
      <pawLoading></pawLoading>
    </v-overlay>
    <!-- Dashboard (Home) -->
    <template v-if="!$route.meta.guest">
      <v-app>
        <!-- Menu navigation -->
        <v-navigation-drawer v-model="drawer" app>
          <!-- Header Sidebar -->
          <v-list class="text-center">
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
            <v-list-item link>
              <v-list-item-content>
                <v-list-item-title class="title">
                  {{ user.first_name }} {{ user.last_name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ user.email }} </v-list-item-subtitle>
              </v-list-item-content>
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
                    <v-list-item-title v-text="option.text"></v-list-item-title>
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
          <v-menu
            offset-y
            left
            bottom
            transition="scroll-y-transition"
            max-width="17rem"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-badge color="green" overlap dot>
                  <v-icon>mdi-bell</v-icon>
                </v-badge>
              </v-btn>
            </template>
            <!-- Lista de notificaciones -->
            <v-list max-height="250" width="17rem">
              <v-subheader>Notificaciones</v-subheader>
              <v-list-item
                v-for="(notification, i) in notifications"
                :key="i"
                @click="
                  () => {
                    // Make a redirect
                  }
                "
              >
                <v-list-item-content>
                  <v-list-item-title>{{
                    notification.title
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    notification.message
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>

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
        <v-main>
          <v-container transition="slide-x-transition" class="pb-10 pa-5">
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
                <a href="#" target="_blank">Juan David M</a>
                y
                <a href="#" target="_blank">Juan Muñoz L</a>
              </small>
            </v-card-text>
          </v-footer>
        </v-main>
      </v-app>
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
export default {
  name: "App",
  data: () => ({
    drawer: null,
    logoutModal: false,
    countedSubOptions: 0,
  }),
  created() {
    // this.$toast("I'm a toast!");
    // Validar si existe la info del usuario
    if (this.user == null) {
      this.getUserLocalStorage();
    }
    if (this.menu.length == 0) {
      this.getMenuLocalStorage();
    }
    // Validar si existe la info del menu
  },
  computed: {
    ...mapState(["user", "menu", "notifications", "loadingOverlay"]),
  },
  methods: {
    ...mapActions([
      "getUserLocalStorage",
      "getMenuLocalStorage",
      "getUser",
      "getMenu",
      "logout",
    ]),
    setCookie(name, value, expirydays) {
      var d = new Date();
      d.setTime(d.getTime() + expirydays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie = name + "=" + value + "; " + expires;
    },
    deleteAllCookies() {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++)
        this.deleteCookie(cookies[i].split("=")[0]);
    },
    deleteCookie(name) {
      this.setCookie(name, "", -1);
    },
    async logoutAction() {
      // Ejecutar el cerrar session
      let result = await this.logout();
      if (result) {
        // Eliminar la cookies de al aplicación
        await this.deleteAllCookies();
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
  },
};
</script>
