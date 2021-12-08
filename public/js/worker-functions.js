var _registration = null;

function registerServiceWorker() {
  return navigator.serviceWorker
    .register("<%= BASE_URL %>js/serviceworker.js")
    .then(function (registration) {
      console.log("Service worker successfully registered.");
      _registration = registration;
      return registration;
    })
    .catch(function (err) {
      console.error("Unable to register service worker.", err);
    });
}

function askPermission() {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });
    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    if (permissionResult !== "granted") {
      throw new Error("We weren't granted permission.");
    } else {
      subscribeUserToPush();
    }
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function getSWRegistration() {
  var promise = new Promise(function (resolve, reject) {
    // do a thing, possibly async, then…
    if (_registration != null) {
      resolve(_registration);
    } else {
      reject(Error("It broke"));
    }
  });
  return promise;
}

function subscribeUserToPush() {
  getSWRegistration()
    .then(function (registration) {
      console.log(registration);
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
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
      sendSubscriptionToBackEnd(pushSubscription);
      return pushSubscription;
    });
}

function sendSubscriptionToBackEnd(subscription) {
  return fetch("/api/save-subscription/PE", {
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
}

registerServiceWorker();

if (window.location.pathname != "/sucursales") {
  askPermission();
}
