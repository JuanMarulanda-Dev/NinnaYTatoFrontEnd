<template>
  <div id="app">
    <!-- Dashboard (Home) -->
    <template v-if="!$route.path.includes('/login')">
      <v-app>
        <!-- Menu navigation -->
        <v-navigation-drawer v-model="drawer" app>
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
                <v-list-item-title class="title">John Leider</v-list-item-title>
                <v-list-item-subtitle>john@vuetifyjs.com</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <!-- Menu options -->
          <v-list nav dense shaped>
            <v-list-item
              v-for="subItem in menuOptions.items"
              :key="subItem.title"
            >
              <v-list-item-content>
                <v-list-item-title v-text="subItem.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item-group v-model="selectedMenuOption" color="secondary">
              <v-list-item v-for="(option, i) in menuOptions" :key="i">
                <v-list-item-icon>
                  <v-icon v-text="option.icon"></v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title v-text="option.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
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
          <v-dialog v-model="logout" persistent max-width="300">
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
                <v-btn color="gray darken-1" text @click="logout = false"
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
          <v-container>
            <router-view></router-view>
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

    <!-- Login -->
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
export default {
  name: "App",
  data: () => ({
    drawer: null,
    logout: false,
    selectedMenuOption: 0,
    menuOptions: [
      { text: "My Files", icon: "mdi-folder" },
      { text: "Shared with me", icon: "mdi-account-multiple" },
      { text: "Starred", icon: "mdi-star" },
      { text: "Recent", icon: "mdi-history" },
      { text: "Offline", icon: "mdi-check-circle" },
      { text: "Uploads", icon: "mdi-upload" },
      { text: "Backups", icon: "mdi-cloud-upload" },
    ],
    notifications: [
      { title: "Opcion 1", message: "esta es una notificación", redirect: "" },
      { title: "Opcion 2", message: "esta es una notificación", redirect: "" },
      { title: "Opcion 3", message: "esta es una notificación", redirect: "" },
    ],
  }),
  methods: {
    logoutAction() {
      // Eliminar la cookie de sesión y el CSRF token
      // Redireccionar al login
      this.$router.push({ name: "Login" });
      this.logout = false;
    },
  },
};
</script>
