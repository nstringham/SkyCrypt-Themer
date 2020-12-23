import { Themes } from "./common";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace extra {
  let themes: Themes;
}

declare function switchTheme(theme: string): void;

declare function loadTheme(currentTheme: string): void;

window.addEventListener("message", (event) => {
  if (event.source === window) {
    switch (event.data?.type) {
      case "set-themes":
        for (const key in event.data.themes) {
          if (!event.data.themes[key].name) {
            event.data.themes[key].name = "Themer Theme";
          }
          extra.themes[key] = event.data.themes[key];
          updateButton(key);
        }
        const currentTheme = localStorage.getItem("currentTheme");
        if (currentTheme) {
          loadTheme(currentTheme);
        }
        break;
      case "switch-theme":
        switchTheme(event.data.theme);
        break;
    }
  }
});

const themesBox = document.getElementById("themes_box");

function makeButton(themeName: string) {
  if (!document.getElementById(`${themeName}-theme`)) {
    const theme = extra.themes[themeName];
    const div = document.createElement("div");
    div.className = "theme";
    div.innerHTML = /*html*/ `
            <img class="theme-icon" src="${
              theme.logo || "/resources/img/logo_square.svg"
            }">
            <span class="theme-name">${theme.name}</span>
            <div class="theme-author">by <span>${theme.author}</span></div>
            <div class="switch_themes_button" id="${themeName}-theme" onclick="switchTheme('${themeName}')">Switch</div>
        `;
    themesBox?.appendChild(div);
  }
}

window.postMessage(
  {
    message: "ready",
  },
  "*"
);

console.log("SkyCrypt Themer successfully injected");
