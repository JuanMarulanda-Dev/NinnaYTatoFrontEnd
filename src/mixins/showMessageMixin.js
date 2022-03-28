exports.install = function (Vue) {
  Vue.prototype.setCookie = (name, value, expirydays) => {
    var d = new Date();
    d.setTime(d.getTime() + expirydays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
  };

  Vue.prototype.deleteCookie = (name) => {
    Vue.prototype.setCookie(name, "", -1);
  };

  Vue.prototype.deleteAllCookies = () => {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++)
      Vue.prototype.deleteCookie(cookies[i].split("=")[0]);
  };

  Vue.prototype.createMessageError = (errors) => {
    let message = "";

    if (typeof errors === "object") {
      for (const item in errors) {
        // Make message
        errors[item].forEach((error) => {
          message += `* ${error}\n`;
        });
      }
    } else {
      message = "Algo no anda bien...";
    }

    return message;
  };

  Vue.prototype.showToastMessage = (status, message) => {
    // Type messages...
    let status_codes = {
      102: () => {
        // Processing
        Vue.$toast.info(message);
      },
      200: () => {
        // Resource created succesfull
        Vue.$toast.success(message);
      },
      201: () => {
        // Resource created succesfull
        Vue.$toast.success(message);
      },
      204: () => {
        // No contect (use to changes status to all resources)
        Vue.$toast.success(message ?? "Estado cambiado exitosamente");
      },
      400: () => {
        // Bad request
        Vue.$toast.warning(message);
      },
      401: () => {
        // Unauthenticate
        // Vue.$toast.warning("Tu sesion a caducado, por favor vuelve a ingresar");
        // Eliminar la sesssion (cookies y localstorage) y retornar al login
        localStorage.clear();
        Vue.prototype.deleteAllCookies();
        location.replace("/login");
      },
      403: () => {
        // access to the requested resource is forbidden.
        Vue.$toast.warning("No tienes permiso para realizar esta acción.");
      },
      500: () => {
        // Server error
        Vue.$toast.error("Ocurrio un error");
      },
    };

    // Execute toast message fuction
    status_codes[status]();
  };
};
