define([], function() {

  // Lifecycle registered serviceworker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js", { scope: "" })
      .then(function(swRegistration) {
        let serviceWorker;

        if (swRegistration.installing) {
          console.log("Resolved at installing: ", swRegistration);
          ServiceWorker = swRegistration.installing;
        } else if (swRegistration.waiting) {
          console.log("Resolved at installed/waiting: ", swRegistration);
          serviceWorker = swRegistration.waiting;
        } else if (swRegistration.active) {
          console.log("resolved at activated: ", swRegistration);
          serviceWorker = swRegistration.active;
        }

        if (serviceWorker) {
          serviceWorker.addEventListener("statechange", function(e) {
            console.log(e.target.state);
          });
        }

        swRegistration.addEventListener("updatefound", function(e) {
          swRegistration.installing.addEventListener("statechange", function(
            e
          ) {
            console.log("New service worker state: ", e.target.state);
          });
          console.log("New service worker found!", swRegistration);
        });
        setInterval(function() {
          swRegistration.update();
        }, 5000);
      })
      .catch(function(error) {
        console.log("Error occured", error);
      });

    navigator.serviceWorker.addEventListener("controllerchange", function(e) {
      console.log("Controller changed");
    });
  }
});
