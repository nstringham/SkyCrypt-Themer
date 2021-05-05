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
          updateButton(key);
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

const themesBox = document.getElementById("themes-box");

function updateButton(themeName: string) {
  const theme = extra.themes[themeName];
  if (theme) {
    const themeElement =
      (document.querySelector(`input[name="theme"][value="${themeName}"]`)?.parentElement as HTMLLabelElement) ??
      themesBox?.appendChild(document.createElement("label"));
    if (themeElement) {
      themeElement.className = "list-item";
      themeElement.innerHTML = /*html*/ `
        <img class="icon" src="${theme.logo}">
        <span class="name">${theme.name}</span>
        <div class="theme-author">by <span>${theme.author}</span></div>
        <input type="radio" name="theme" value="${themeName}">
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
