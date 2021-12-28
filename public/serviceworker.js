self.addEventListener("push", function (event) {
  if (event.data) {
    var data = event.data.body.json();
    self.registration.showNotification(data.title, {
      body: data.description,
      icon: "favicon.png",
      vibrate: [200, 100, 200],
    });
    //
    self.clients.matchAll().then((all) =>
      all.forEach((client) => {
        client.postMessage(data);
      })
    );
    // console.log("This push event has data: ", event.data.text());
  } else {
    console.log("This push event has no data.");
  }
});
