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
        const currentTheme = localStorage.getItem("currentTheme");
        for (const key in event.data.themes) {
          if (!event.data.themes[key].name) {
            event.data.themes[key].name = "Themer Theme";
          }
          extra.themes[key] = event.data.themes[key];
          updateButton(key, currentTheme === key);
        }
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

function updateButton(themeName: string, selected?: boolean) {
  const theme = extra.themes[themeName];
  if (theme) {
    const themeElement =
      document.getElementById(`${themeName}-theme`)?.parentElement || themesBox?.appendChild(document.createElement("div"));
    if (themeElement) {
      themeElement.className = "theme";
      themeElement.innerHTML = /*html*/ `
        <img class="theme-icon" src="${theme.logo}">
        <span class="theme-name">${theme.name}</span>
        <div class="theme-author">by <span>${theme.author}</span></div>
        <div class=${
          selected ? "selected_button" : "switch_themes_button"
        } id="${themeName}-theme" onclick="switchTheme('${themeName}')">${selected ? "In Use" : "Switch"}</div>
      `;
    }
  }
}

window.postMessage(
  {
    message: "ready",
  },
  "*"
);

console.log("SkyCrypt Themer successfully injected");
