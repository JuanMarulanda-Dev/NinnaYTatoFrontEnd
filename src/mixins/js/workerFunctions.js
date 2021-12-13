exports.install = function (Vue, options) {
  Vue.axios.defaults.withCredentials = true;

  Vue._registration = null;
  Vue.prototype.registerServiceWorker = () => {
    return navigator.serviceWorker
      .register("serviceworker.js")
      .then(function (registration) {
        console.log("Service worker successfully registered.");
        Vue._registration = registration;
        return registration;
      })
      .catch(function (err) {
        console.error("Unable to register service worker.", err);
      });
  };

  Vue.prototype.askPermission = (user_id) => {
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (
        result
      ) {
        resolve(result);
      });
      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then(function (permissionResult) {
      if (permissionResult !== "granted") {
        throw new Error("We weren't granted permission.");
      } else {
        Vue.prototype.subscribeUserToPush(user_id);
      }
    });
  };

  Vue.prototype.urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  Vue.prototype.getSWRegistration = () => {
    var promise = new Promise(function (resolve, reject) {
      // do a thing, possibly async, then…
      if (Vue._registration != null) {
        resolve(Vue._registration);
      } else {
        reject(Error("It broke"));
      }
    });
    return promise;
  };

  Vue.prototype.subscribeUserToPush = (user_id) => {
    Vue.prototype
      .getSWRegistration()
      .then(function (registration) {
        console.log(registration);
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: Vue.prototype.urlBase64ToUint8Array(
            options.vapip
          ),
        };
        return registration.pushManager.subscribe(subscribeOptions);
      })
      .then(function (pushSubscription) {
        console.log(
          "Received PushSubscription: ",
          JSON.stringify(pushSubscription)
        );
        Vue.prototype.sendSubscriptionToBackEnd(pushSubscription, user_id);
        return pushSubscription;
      });
  };

  Vue.prototype.sendSubscriptionToBackEnd = (subscription, user_id) => {
    return Vue.axios
      .post(
        `https://ninnaytato.ga/api/save-subscription/${user_id}`,
        subscription
      )
      .then(function (response) {
        if (response.status != 201) {
          throw new Error("Bad status code from server.");
        }
        return response;
      })
      .then(function (responseData) {
        if (!(responseData.data && responseData.data.success)) {
          throw new Error("Bad response from server.");
        }
      });
  };
};
