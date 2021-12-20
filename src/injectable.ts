import { Themes } from "./common";

type ThemeList = HTMLElement & { reloadURLs: () => void };

window.addEventListener("message", (event) => {
  if (event.source === window) {
    switch (event.data?.type) {
      case "set-themes":
        const urls = Object.values(event.data.themes as Themes).map((theme) => {
          if (!theme.name) {
            theme.name = "Themer Theme";
          }
          return "data:application/json;base64," + btoa(JSON.stringify(theme));
        });
        localStorage.setItem("customThemeUrls", JSON.stringify(urls));
        document.querySelector<ThemeList>("#themes-box")?.reloadURLs?.();
        break;
    }
  }
});

console.log("SkyCrypt Themer successfully injected");
