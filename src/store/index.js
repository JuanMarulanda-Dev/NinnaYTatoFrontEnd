import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default new Vuex.Store({
  state: {
    // Dashboard
    user: null,
    auth: false,
    menu: [
      {
        text: "Sucuarsales",
        icon: "mdi-home-group",
        to: "/sucursales",
        permissions: {
          create: 1,
          read: 1,
          update: 1,
          delete: 1,
        },
      },
      {
        text: "Usuarios",
        icon: "mdi-account-multiple",
        to: "/usuarios",
      },
      { text: "Clientes", icon: "mdi-paw", to: "/clientes" },
      {
        text: "Inventario",
        icon: "mdi-clipboard-check",
        items: [
          {
            text: "Ingreso de stock",
            icon: "mdi-clipboard-text",
            to: "/stock",
          },
          { text: "Accesorios", icon: "mdi-puzzle", to: "/accesorios" },
          { text: "Planes", icon: "mdi-note-outline", to: "/planes" },
        ],
      },
      { text: "Tienda", icon: "mdi-cart", to: "/tienda" },
      {
        text: "Guarderia",
        icon: "mdi-home-heart",
        items: [
          {
            text: "Entrada y salida",
            icon: "mdi-transit-transfer",
            to: "/ingresos",
          },
          {
            text: "Recomendaciones",
            icon: "mdi-file-edit-outline",
            to: "/recomendaciones",
          },
          {
            text: "Habitaciones",
            icon: "mdi-home-modern",
            to: "/habitaciones",
          },
        ],
      },
      { text: "Finanzas", icon: "mdi-wallet", to: "/finanzas" },
      {
        text: "Estadistica",
        icon: "mdi-chart-timeline-variant",
        to: "/estadisticas",
      },
      { text: "Historial", icon: "mdi-history", to: "/historial" },
    ],
    notifications: [
      { title: "Opcion 1", message: "esta es una notificación", redirect: "" },
      { title: "Opcion 2", message: "esta es una notificación", redirect: "" },
      { title: "Opcion 3", message: "esta es una notificación", redirect: "" },
    ],
    //General Icons
    editIcon: process.env.VUE_APP_ICON_EDIT ?? "mdi-pencil",
    deleteIcon: process.env.VUE_APP_ICON_DELETE ?? "mdi-delete",
    detailsIcon: process.env.VUE_APP_ICON_DETAILS ?? "mdi-book-open-variant",
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.auth = Boolean(user);
    },
  },
  actions: {
    async login({ dispatch }, credentials) {
      console.log(credentials);
      await axios.get("/sanctum/csrf-cookie");
      let result = await axios.post("/api/login", credentials);
      console.log(result.data.errors);
      return dispatch("getUser");
    },
    getUser({ commit }) {
      axios
        .get("/api/user", this.form)
        .then((result) => {
          commit("SET_USER", result.data);
        })
        .catch(() => {
          commit("SET_USER", null);
        });
    },
    getMenu() {},
  },
  modules: {},
});
