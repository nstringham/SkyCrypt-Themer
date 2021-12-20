import { Themes } from "./common";

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

chrome.storage.sync.get("themes", (result) => {
  if (result.themes) {
    sendThemes(result.themes);
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
    }
  });
});
