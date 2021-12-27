self.addEventListener("push", function (event) {
  if (event.data) {
    var data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "https://ninnaytato.s3.us-east-2.amazonaws.com/alerta.png",
    });
    //
    self.clients.matchAll().then((all) =>
      all.forEach((client) => {
        client.postMessage("Responding to " + event.data);
      })
    );
    // console.log("This push event has data: ", event.data.text());
  } else {
    console.log("This push event has no data.");
  }
});
