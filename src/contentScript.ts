import { Themes } from "./common";

const scriptElement = document.createElement("script");
scriptElement.type = "module";
scriptElement.src = chrome.runtime.getURL("injectable.js");
document.head.appendChild(scriptElement);

function sendThemes(themes: Themes) {
  window.postMessage(
    {
      type: "set-themes",
      themes,
    },
    "https://sky.shiiyu.moe"
  );
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync") {
    if (changes.themes) {
      sendThemes(changes.themes.newValue);
    }
  }
});

window.addEventListener("message", (event) => {
  if (event.source === window && event.data?.message === "ready") {
    chrome.storage.sync.get("themes", (result) => {
      if (result.themes) {
        sendThemes(result.themes);
      }
    });
  }
});

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((request) => {
    if (["switch-theme", "set-styles"].includes(request.type)) {
      window.postMessage(request, "https://sky.shiiyu.moe");
    }
  });
});
