import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";

Vue.use(Vuex);
import axios from "axios";
import sucursales from "@/modules/sucursales.js";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default new Vuex.Store({
  state: {
    // Login
    loadingLogin: false,

    // Dashboard
    user: null,
    auth: false,
    menu: [],
    notifications: [
      { title: "Opcion 1", message: "esta es una notificación", redirect: "" },
      { title: "Opcion 2", message: "esta es una notificación", redirect: "" },
      { title: "Opcion 3", message: "esta es una notificación", redirect: "" },
    ],
    loadingOverlay: false,
    loadingMenu: false,
    loadingText: "Cargando datos...",

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
    SET_MENU(state, menu) {
      state.menu = menu;
    },
    SET_LOADER_LOGIN(state, loader = false) {
      state.loadingLogin = loader;
    },
    SET_LOADER_MENU(state, loader = false) {
      state.loadingMenu = loader;
    },
  },
  actions: {
    async login({ dispatch, commit }, credentials) {
      try {
        // Activar el loading del boton ingresar
        commit("SET_LOADER_LOGIN", true);
        // Obtener la cookie de autentificación y CSRF Token para la sutentificacion del SPA y politicas CORS
        await axios.get("/sanctum/csrf-cookie");
        // Hacer login con las credenciales del usuario
        let result = await axios.post("/api/login", credentials);
        if (result.data.errors) {
          // Ocurrio algun error en la autentificación
          console.log(result.data.errors);
          // Mostar la notificación
          return;
        }
        // Obtener el usuario
        dispatch("getUser");
        // Obtener los permisos del usuario
        dispatch("getMenu");
        // Obtener la ruta principal a donde se va a redireccionar al usuario
        // Redirrecionar a la ruta pertiente para el usuario
        router.push("Sucursales");
      } catch (error) {
        // Mostrar el mensaje al usuario que ocurrio algun inconveninte
        console.log(error);
      } finally {
        commit("SET_LOADER_LOGIN");
      }
    },

    async getUser({ commit, dispatch }) {
      await axios
        .get("/api/user", this.form)
        .then((result) => {
          commit("SET_USER", result.data);
          // Guardar el usuario en el local storage
          dispatch("storeUserLocalStorage");
        })
        .catch(() => {
          commit("SET_USER", null);
        });
    },

    async getMenu({ commit, dispatch }) {
      // El menu se deberia guardar en cache
      commit("SET_LOADER_MENU", true);
      try {
        // Obtener el menu del usuario que se logueo
        let result = await axios.get("/api/permissions");
        let menuJson = JSON.parse(result.data.menu);
        commit("SET_MENU", menuJson);
        // Guardar el menu en el local storage
        dispatch("storeMenuLocalStorage");
      } catch (error) {
        console.log(error);
      } finally {
        commit("SET_LOADER_MENU");
      }
    },

    // Almacenamiento en local storage
    storeUserLocalStorage({ state }) {
      // Se encripta el contenido antes de almacenarlo
      let encrypt = window.btoa(JSON.stringify(state.user));
      localStorage.setItem("User", encrypt);
    },

    storeMenuLocalStorage({ state }) {
      // Se encripta el contenido antes de almacenarlo
      let encrypt = window.btoa(JSON.stringify(state.menu));
      localStorage.setItem("Menu", encrypt);
    },

    getUserLocalStorage({ commit }) {
      let user = atob(localStorage.getItem("User"));
      let decryp = JSON.parse(user);
      commit("SET_USER", decryp);
    },

    getMenuLocalStorage({ commit }) {
      let menu = atob(localStorage.getItem("Menu"));
      let decryp = JSON.parse(menu);
      commit("SET_MENU", decryp);
    },
  },
  modules: {
    sucursales,
  },
});
