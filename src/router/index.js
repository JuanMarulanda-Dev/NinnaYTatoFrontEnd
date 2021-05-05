import Vue from "vue";
// import store from "@/store";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "@/views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      guest: true,
    },
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/sucursales",
    name: "Sucursales",
    component: () =>
      import(/* webpackChunkName: "sucursales" */ "@/views/Sucursales.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   // Validar si la ruta es designada para un visitante
//   if (to.matched.some((record) => record.meta.guest)) {
//     next();
//   } else {
//     // Validar si el menu y el usuario estan en el local storage
//     if (
//       localStorage.getItem("user") == null ||
//       localStorage.getItem("menu") == null
//     ) {
//       // Hacer logout del usuario
//       // Redireccionar al login
//       next({ name: "Login" });
//     } else {
//       // Si existe el menu y el usuario en el local storage
//       if (!store.state.isAuthenticated) {
//         next({ name: "Login" });
//       } else {
//         // Validar que ese usuario tenga permiso de ingresar a ese modulo
//         for (const permission in store.state.menu) {
//           console.log(permission);
//         }
//         next();
//       }
//     }
//   }
// });

export default router;
