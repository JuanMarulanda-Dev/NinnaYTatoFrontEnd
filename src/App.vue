<template>
  <div id="app">
    <!-- Dashboard (Home) -->
    <template v-if="!$route.path.includes('/login')">
      <v-app>
        <!-- Menu navigation -->
        <v-navigation-drawer v-model="drawer" app>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
              </v-list-item-avatar>
            </v-list-item>

            <v-list-item link>
              <v-list-item-content>
                <v-list-item-title class="title">John Leider</v-list-item-title>
                <v-list-item-subtitle>john@vuetifyjs.com</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>mdi-menu-down</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list nav dense>
            <v-list-item v-for="subItem in item.items" :key="subItem.title">
              <v-list-item-content>
                <v-list-item-title v-text="subItem.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item-group v-model="item" color="primary">
              <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
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
          <v-btn icon>
            <v-badge color="green" overlap dot>
              <v-icon>mdi-bell</v-icon>
            </v-badge>
          </v-btn>
          <!-- Prifile -->
          <v-menu open-on-hover right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on">
                <v-icon>mdi-account-circle</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item v-for="(item, i) in itemsDrow" :key="i">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-app-bar>

        <!-- Content -->
        <v-main>
          <v-container>
            <router-view></router-view>
          </v-container>

          <!-- Footer -->
          <v-footer color="primary" fixed>
            <v-spacer></v-spacer>
            <div>&copy; {{ new Date().getFullYear() }}</div>
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
    item: 0,
    items: [
      { text: "My Files", icon: "mdi-folder" },
      { text: "Shared with me", icon: "mdi-account-multiple" },
      { text: "Starred", icon: "mdi-star" },
      { text: "Recent", icon: "mdi-history" },
      { text: "Offline", icon: "mdi-check-circle" },
      { text: "Uploads", icon: "mdi-upload" },
      { text: "Backups", icon: "mdi-cloud-upload" },
    ],
    itemsDrow: [
      { title: "Click Me" },
      { title: "Click Me" },
      { title: "Click Me" },
      { title: "Click Me 2" },
    ],
  }),
};
</script>
