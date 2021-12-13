self.addEventListener("push", function (event) {
  if (event.data) {
    var data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "favicon.svg",
    });
    console.log("This push event has data: ", event.data.text());
  } else {
    console.log("This push event has no data.");
  }
});
