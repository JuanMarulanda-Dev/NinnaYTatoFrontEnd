self.addEventListener("push", function (event) {
  if (event.data) {
    var data = event.data.json();
    self.registration.showNotification(data.body.title, {
      body: data.body.description,
      icon: "favicon.png",
      vibrate: [200, 100, 200],
    });
    //
    // console.log(event.clientId);
    self.controller.postMessage(data.body);
    // self.clients.matchAll().then((all) =>
    //   all.forEach((client) => {

    //   })
    // );
    // console.log("This push event has data: ", event.data.text());
  } else {
    console.log("This push event has no data.");
  }
});
