<template>
  <div id="app">
    <!-- Dashboard -->
    <template v-if="!$route.path.includes('/')">
      <v-app>
        <v-main> </v-main>
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
    //
  }),
};
</script>
