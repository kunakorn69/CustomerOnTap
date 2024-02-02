var deferredPrompt;

let installApp = {
  init: () => {
    installApp.defaultFunction();
    installApp.serviceWorker();
  },
  defaultFunction: async () => {
    //install APP  start
    // showAddToHomeScreen();

    // 		$(window).on('beforeinstallprompt', function(e){
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("beforeinstallprompt");
      e.preventDefault();
      deferredPrompt = e;
      //   showAddToHomeScreen();
      installApp.createDocument();
    });

    //install App end
  },

  addToHomeScreen: () => {
    if (deferredPrompt !== undefined) {
      deferredPrompt.prompt(); // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then(function (choiceResult) {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
          var d = new Date();
          d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
          var expires = "expires=" + d.toUTCString();
          document.cookie =
            "removeInstall_" + app_id + "=" + 1 + ";" + expires + ";path=/";
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        deferredPrompt = null;
      });
    } else {
      console.log("beforeinstallprompt not fired");
    }
  },

  createDocument: () => {
    let element = document.createElement("div");

    element.style.padding = "10px 20px";
    element.style.position = "fixed";
    element.style.bottom = 0;
    element.style.right = 0;
    element.style.zIndex = "9999999!important";
    element.style.borderRadius = "10px";
    element.style.backgroundColor = "#010038";

    const paragraph = document.createElement("p");
    paragraph.style.color = "white";
    paragraph.style.fontSize = "13px";
    paragraph.style.lineHeight = 1.6;
    paragraph.innerHTML =
      "Install website  to your device  It won't take up space <br/> and also works offline!";

    const container = document.createElement("div");

    container.style.cssText = `display:flex; align-items:center;  justifyContent:space-between; width:100%; marginTop:-5px`;

    const installButton = document.createElement("button");

    installButton.style.cssText = `background-color: green; margin-top:2em; cursor: pointer; color: white; font-size: 12px; border: 0; padding: 10px 15px; box-shadow: 0 0 50px #ccc; border-radius: 5px; margin-right:15px`;

    installButton.id = "install-pwa";
    installButton.innerText = "Install ";

    const declineButton = document.createElement("button");

    declineButton.style.cssText = `background-color: red; margin-top:2em; cursor: pointer; color: white; font-size: 12px; border: 0; padding: 10px 15px; box-shadow: 0 0 50px #ccc; border-radius: 5px`;

    declineButton.id = "decline-pwa";

    declineButton.innerText = "Dismiss ";

    container.appendChild(installButton);

    container.appendChild(declineButton);

    element.appendChild(paragraph);

    element.appendChild(container);

    document.body.appendChild(element);

    document.addEventListener("click", function (event) {
      if (event.target && event.target.id === "install-pwa") {
        installApp.addToHomeScreen();
        element.style.display = "none";
        return;
      }

      if (event.target && event.target.id === "decline-pwa") {
        return (element.style.display = "none");
      }
      return false;
    });
  },

  serviceWorker: () => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", (event) => {
        // window.addEventListener('DOMContentLoaded', (event) => {
        navigator.serviceWorker
          .register("pwa.js")
          .then((res) => {
            console.log("service worker registered");
          })
          .catch((err) => console.log("service worker not registered", err));
      });
    }
  },
};

window.addEventListener("DOMContentLoaded", (event) => {
  installApp.init();
});
