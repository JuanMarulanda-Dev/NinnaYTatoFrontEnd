import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";

Vue.use(Vuex);
import axios from "axios";
import sucursales from "@/modules/sucursales.js";
import users from "@/modules/users.js";
import customers from "@/modules/customers.js";
import pets from "@/modules/pets.js";
import products from "@/modules/products.js";
import suppliers from "@/modules/suppliers.js";
import plans from "@/modules/plans.js";
import plans_details from "@/modules/plans_details.js";
import discounts from "@/modules/discounts.js";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default new Vuex.Store({
  state: {
    // Login
    loadingLogin: false,

    // Dashboard
    user: null,
    isAuthenticated: false,
    menu: [],
    notifications: [
      { title: "Opcion 1", message: "esta es una notificación", redirect: "" },
      { title: "Opcion 2", message: "esta es una notificación", redirect: "" },
      { title: "Opcion 3", message: "esta es una notificación", redirect: "" },
    ],
    loadingOverlay: false,
    loadingText: "Cargando datos...",
    deleteDialog: false,

    //General Icons
    editIcon: process.env.VUE_APP_ICON_EDIT ?? "mdi-pencil",
    deleteIcon: process.env.VUE_APP_ICON_DELETE ?? "mdi-delete",
    detailsIcon: process.env.VUE_APP_ICON_DETAILS ?? "mdi-book-open-variant",
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = Boolean(user);
    },
    SET_MENU(state, menu) {
      state.menu = menu;
    },
    SET_LOADER_LOGIN(state, loader = false) {
      state.loadingLogin = loader;
    },
    SET_OVERLAY_LOADING(state, loader = false) {
      state.loadingOverlay = loader;
    },
  },
  actions: {
    // Todas estas acciones pertenecen a las funcionalidades del login (Modular)
    async login({ state, dispatch, commit }, credentials) {
      try {
        commit("SET_OVERLAY_LOADING", true);
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
        await dispatch("getUser");
        // Obtener los permisos del usuario
        await dispatch("getMenu");
        // Obtener la ruta principal a donde se va a redireccionar al usuario
        // Redirrecionar a la ruta pertiente para el usuario
        router.push({ path: state.menu[0].to });
      } catch (error) {
        // Mostrar el mensaje al usuario que ocurrio algun inconveninte (Los mensajes deben venir del backend)
        this._vm.$toast.warning("El usuario o la contraseña son incorrectos.");
      } finally {
        commit("SET_OVERLAY_LOADING");
        commit("SET_LOADER_LOGIN");
      }
    },

    async logout({ commit }) {
      try {
        commit("SET_OVERLAY_LOADING", true);
        await axios.get("/api/logout");
        return true;
      } catch (error) {
        console.log(error);
        return false;
      } finally {
        commit("SET_OVERLAY_LOADING");
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
      try {
        // Obtener el menu del usuario que se logueo
        let result = await axios.get("/api/permissions");
        let menuJson = JSON.parse(result.data.menu);
        commit("SET_MENU", menuJson);
        // Guardar el menu en el local storage
        dispatch("storeMenuLocalStorage");
      } catch (error) {
        console.log(error);
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
      let user = localStorage.getItem("User");
      if (user) {
        let decryp = JSON.parse(atob(user));
        commit("SET_USER", decryp);
      }
    },

    getMenuLocalStorage({ commit }) {
      let menu = localStorage.getItem("Menu");
      if (menu) {
        let decryp = JSON.parse(atob(menu));
        commit("SET_MENU", decryp);
      }
    },

    goBack() {
      router.go(-1);
    },
  },
  modules: {
    sucursales,
    users,
    customers,
    pets,
    products,
    suppliers,
    plans,
    plans_details,
    discounts,
  },
});
