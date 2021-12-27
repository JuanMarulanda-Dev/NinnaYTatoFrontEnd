import Vue from "vue";
export const eventBus = new Vue();

export const ServiceWorker = () => {
  self.addEventListener("push", function (event) {
    if (event.data) {
      var data = event.data.json();
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: "favicon.png",
      });
      console.log("This push event has data: ", event.data.text());
      eventBus.$emit("notification", data);
    } else {
      console.log("This push event has no data.");
    }
  });
};
