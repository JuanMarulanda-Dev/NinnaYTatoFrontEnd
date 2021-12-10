exports.install = function (Vue, options) {
  Vue._registration = null;
  Vue.prototype.registerServiceWorker = () => {
    return navigator.serviceWorker
      .register(options.serviceworker)
      .then(function (registration) {
        console.log("Service worker successfully registered.");
        this._registration = registration;
        return registration;
      })
      .catch(function (err) {
        console.error("Unable to register service worker.", err);
      });
  };

  Vue.prototype.askPermission = () => {
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
        this.subscribeUserToPush();
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
      if (this._registration != null) {
        resolve(this._registration);
      } else {
        reject(Error("It broke"));
      }
    });
    return promise;
  };

  Vue.prototype.subscribeUserToPush = () => {
    this.getSWRegistration()
      .then(function (registration) {
        console.log(registration);
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(
            "BK2930BjqfA1WqOKAj6e4hxxGc1qIqRUZPbqTaRgI29vf1oEgWvqzL1tHId8UfLB69PQqF8Lnt7MgzTSUAnKmMo"
          ),
        };
        return registration.pushManager.subscribe(subscribeOptions);
      })
      .then(function (pushSubscription) {
        console.log(
          "Received PushSubscription: ",
          JSON.stringify(pushSubscription)
        );
        this.sendSubscriptionToBackEnd(pushSubscription);
        return pushSubscription;
      });
  };

  Vue.prototype.sendSubscriptionToBackEnd = (subscription) => {
    return fetch("https://ninnaytato.ga/api/save-subscription/PE", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Bad status code from server.");
        }
        return response.json();
      })
      .then(function (responseData) {
        if (!(responseData.data && responseData.data.success)) {
          throw new Error("Bad response from server.");
        }
      });
  };
};
