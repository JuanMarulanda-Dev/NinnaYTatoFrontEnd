self.addEventListener("push", function (event) {
  if (event.data) {
    var data = event.data.json();
    self.registration.showNotification(data.data.title, {
      body: data.data.description,
      icon: "favicon.png",
      badge: "favicon.png",
      vibrate: [300, 100, 400],
    });

    //
    // navigator.serviceWorker.controller.postMessage(data);
    // self.navigator.serviceWorker.postMessage(data);
    // console.log(event.clientId);
    // console.log(self.clients.get());
    // // .postMessage(data.body);
    // self.controller.postMessage(data.body);
    self.clients.matchAll().then((all) =>
      all.forEach((client) => {
        client.postMessage(data.data);
      })
    );
    // console.log("This push event has data: ", event.data.text());
  } else {
    console.log("This push event has no data.");
  }
});
