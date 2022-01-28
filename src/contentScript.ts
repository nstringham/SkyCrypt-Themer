import { Themes } from "./common";

function sendThemes(themes: Themes) {
  const urls = Object.values(themes).map((theme) => {
    if (!theme.name) {
      theme.name = "Themer Theme";
    }
    return "data:application/json;base64," + btoa(JSON.stringify(theme));
  });
  localStorage.setItem("customThemeUrls", JSON.stringify(urls));
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
