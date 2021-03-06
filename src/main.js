import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VuetifyConfirm from "vuetify-confirm"; //https://www.npmjs.com/package/vuetify-confirm
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import "@/styles/main.css";
import "@/styles/main.scss";
import axios from "axios";
import VueAxios from "vue-axios";
import Vuelidate from "vuelidate";
import showMessageMixin from "@/mixins/showMessageMixin.js"; // my own helper
import dateMixin from "@/mixins/dateMixin.js"; // my own helper
import workerFunctions from "@/mixins/js/workerFunctions.js"; // my own helper
import moment from "moment";
import VueMoment from "vue-moment";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css"; // https://maronato.github.io/vue-toastification/
import VueApexCharts from "vue-apexcharts";

const options = {
  position: "top-right",
  timeout: 3016,
  closeOnClick: true,
};

Vue.use(Toast, options);

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(Vuelidate);
Vue.use(VuetifyConfirm, { vuetify });
Vue.use(VueApexCharts);

Vue.component("apexchart", VueApexCharts);

// moment configuration
require("moment/locale/es");
moment.locale("es");
Vue.use(VueMoment, { moment });

// My helpers
Vue.use(showMessageMixin);
Vue.use(dateMixin);
Vue.use(workerFunctions, {
  vapip:
    "BK2930BjqfA1WqOKAj6e4hxxGc1qIqRUZPbqTaRgI29vf1oEgWvqzL1tHId8UfLB69PQqF8Lnt7MgzTSUAnKmMo",
}); //process.env.VAPID_PUBLIC_KEY

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
