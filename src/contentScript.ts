import { Themes } from "./common";

const scriptElement = document.createElement("script");
scriptElement.type = "module";
scriptElement.src = chrome.runtime.getURL("injectable.js");
document.head.appendChild(scriptElement);

const logoUrl = chrome.runtime.getURL("logo-128.png");

function sendThemes(themes: Themes) {
  for (const i in themes) {
    if (!themes[i].logo) {
      themes[i].logo = logoUrl;
    }
  }
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

let animationFrameID = -1;

const rootStyle = document.documentElement.style;

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((request) => {
    switch (request?.type) {
      case "set-styles":
        if (animationFrameID >= 0) {
          cancelAnimationFrame(animationFrameID);
        }
        animationFrameID = requestAnimationFrame(() => {
          for (const key in request.styles) {
            rootStyle.setProperty(key, request.styles[key]);
          }
          animationFrameID = -1;
        });
        break;
      case "switch-theme":
        window.postMessage(request, "https://sky.shiiyu.moe");
        break;
    }
  });
});
