import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import "@/styles/main.css";
import axios from "axios";
import VueAxios from "vue-axios";
import Vuelidate from "vuelidate";

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
// https://maronato.github.io/vue-toastification/

const options = {
  position: "top-right",
  timeout: 3016,
  closeOnClick: true,
};

Vue.use(Toast, options);

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(Vuelidate);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
