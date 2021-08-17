exports.install = function (Vue) {
  Vue.prototype.createMessageError = function (errors) {
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

  Vue.prototype.showToastMessage = function (status, message) {
    {
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
          Vue.$toast.success("Estado cambiado exitosamente");
        },
        400: () => {
          // Bad request
          Vue.$toast.warning(message);
        },
        401: () => {
          // Unauthenticate
          Vue.$toast.warning(message);
          // Eliminar la sesssion y retornar al login
          // pendding...
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
    }
  };
};
