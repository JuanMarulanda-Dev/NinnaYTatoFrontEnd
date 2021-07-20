exports.install = function (Vue) {
  Vue.prototype.createMessageError = function (errors) {
    let message = "";

    if (Array.isArray(errors)) {
      // Make message
      errors.forEach((error) => {
        message += `* ${error}\n`;
      });
    } else {
      message = "Algo no anda bien...";
    }

    return message;
  };

  Vue.prototype.showToastMessage = function (status, message) {
    {
      // Type messages...
      let status_codes = {
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
