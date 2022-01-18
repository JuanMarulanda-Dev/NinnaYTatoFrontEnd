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
  {
    path: "/clientes",
    component: () =>
      import(/* webpackChunkName: "Customers" */ "@/views/Customers.vue"),
    meta: {
      permissions: {},
    },
    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "CustomersTable" */ "@/components/customers/CustomersTable.vue"
          ),
      },
      {
        path: "registro",
        component: () =>
          import(
            /* webpackChunkName: "CustomerForm" */ "@/components/customers/CustomersForm.vue"
          ),
      },
      {
        path: "detalles/:customer",
        component: () =>
          import(
            /* webpackChunkName: "CustomerDetails" */ "@/components/customers/CustomerDetails.vue"
          ),
      },
      {
        path: "detalles/:customer/editar",
        component: () =>
          import(
            /* webpackChunkName: "CustomerFormUpdate" */ "@/components/customers/CustomerFormUpdate.vue"
          ),
      },
      {
        path: "detalles/:customer/mascota/:pet",
        component: () =>
          import(
            /* webpackChunkName: "PetDetails" */ "@/components/customers/pets/PetDetails.vue"
          ),
      },
      {
        path: "detalles/:customer/mascota/:pet/editar",
        component: () =>
          import(
            /* webpackChunkName: "PetForm" */ "@/components/customers/pets/PetForm.vue"
          ),
      },
      {
        path: "detalles/:customer/mascota",
        component: () =>
          import(
            /* webpackChunkName: "PetForm" */ "@/components/customers/pets/PetForm.vue"
          ),
      },
    ],
  },
  {
    path: "/productos",
    name: "Productos",
    component: () =>
      import(/* webpackChunkName: "Products" */ "@/views/Products.vue"),
    meta: {
      permissions: {},
    },
  },
  {
    path: "/planes",
    name: "Planes",
    component: () =>
      import(/* webpackChunkName: "Plans" */ "@/views/Plans.vue"),
    meta: {
      permissions: {},
    },
  },
  {
    path: "/cajas",
    name: "Cajas",
    component: () =>
      import(
        /* webpackChunkName: "CashRegisters" */ "@/views/CashRegisters.vue"
      ),
    meta: {
      permissions: {},
    },
  },
  {
    path: "/compras",
    name: "Compras",
    component: () =>
      import(/* webpackChunkName: "Puarchases" */ "@/views/Purchases.vue"),
    meta: {
      permissions: {},
    },
  },
  {
    path: "/habitaciones",
    name: "Habitaciones",
    component: () =>
      import(/* webpackChunkName: "Rooms" */ "@/views/Rooms.vue"),
    meta: {
      permissions: {},
    },
  },
  {
    path: "/historial",
    name: "Historial",
    component: () =>
      import(/* webpackChunkName: "Records" */ "@/views/Records.vue"),
    meta: {
      permissions: {},
    },
  },
  {
    path: "/ventas",
    name: "ventas",
    component: () =>
      import(/* webpackChunkName: "Sales" */ "@/views/Sales.vue"),
    meta: {
      permissions: {},
    },
  },
  {
    path: "/alojamientos",
    name: "alojamientos",
    component: () =>
      import(/* webpackChunkName: "Lodging" */ "@/views/Lodging.vue"),
    meta: {
      permissions: {},
    },
  },
  {
    path: "/reservas",
    name: "Reservas",
    component: () =>
      import(/* webpackChunkName: "Reservas" */ "@/views/Reservations.vue"),
    meta: {
      permissions: {},
    },
  },
  {
    path: "/recomendaciones",
    name: "Recomendaciones",
    component: () =>
      import(/* webpackChunkName: "Alerts" */ "@/views/Alerts.vue"),
    meta: {
      permissions: {},
    },
  },
  {
    path: "/movimientos",
    name: "Recomendaciones",
    component: () =>
      import(/* webpackChunkName: "Movimientos" */ "@/views/Movements.vue"),
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
      // *******
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
