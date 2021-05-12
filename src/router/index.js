import Vue from "vue";
import store from "@/store";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/404",
    name: "NotFound",
    component: () =>
      import(/* webpackChunkName: "404" */ "@/views/code/404.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "Login" */ "@/views/Login.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/sucursales",
    name: "Sucursales",
    component: () =>
      import(/* webpackChunkName: "BranchOffice" */ "@/views/BranchOffice.vue"),
    meta: {
      permissions: {},
    },
  },
  {
    path: "/usuarios",
    name: "Usuarios",
    component: () =>
      import(/* webpackChunkName: "Users" */ "@/views/Users.vue"),
    meta: {
      permissions: {},
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // Validar si la ruta es designada para un visitante
  if (to.matched.some((record) => record.meta.guest)) {
    next();
  } else {
    // Validar si el menu y el usuario estan en el local storage
    if (
      localStorage.getItem("User") == null ||
      localStorage.getItem("Menu") == null
    ) {
      // Hacer logout del usuario (Pendiente)
      // Redireccionar al login
      next({ name: "Login" });
    } else {
      // Traer el menu de local storage
      store.dispatch("getMenuLocalStorage");
      // Validar que ese usuario tenga permiso de ingresar a ese modulo
      let result = store.state.menu.some((option) => {
        // Validar si existen subopciones en la opcion
        if (option.items) {
          // Validar si esa opcion existe como subOpcion
          let subResult = option.items.some((subOption) => {
            if (to.fullPath.includes(subOption.to)) {
              // Se añaden los metadatos de permisos
              to.meta.permissions = subOption.permissions;
              next();
              return true;
            }
          });
          if (subResult) {
            return true;
          }
        } else if (to.fullPath.includes(option.to)) {
          // Se añaden los metadatos de permisos
          to.meta.permissions = option.permissions;
          next();
          return true;
        }
      });

      if (!result) {
        next({ name: "NotFound" });
      }
    }
  }
});

export default router;
