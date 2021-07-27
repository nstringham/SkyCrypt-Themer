import { Themes } from "./common";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace extra {
  let themes: Themes;
}

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
        removeExtraButtons(Object.keys(event.data.themes));
        if (currentTheme) {
          const checkbox = document.querySelector(`#themes-box input[value="${currentTheme}"]`) as HTMLInputElement;
          checkbox.checked = false;
          checkbox.click();
        }
        break;
      case "switch-theme":
        document.querySelector<HTMLInputElement>(`input[name="theme"][value="${event.data.theme}"]`)?.click();
        break;
    }
  }
});

const themesBox = document.getElementById("themes-box");

function updateButton(themeName: string, selected?: boolean) {
  const theme = extra.themes[themeName];
  if (theme) {
    const themeElement =
      (document.querySelector(`input[name="theme"][value="${themeName}"]`)?.parentElement as HTMLLabelElement) ??
      themesBox?.appendChild(document.createElement("label"));
    themeElement.className = "list-item";
    themeElement.innerHTML = /*html*/ `
      <img class="icon" src="/resources/img/logo_square.svg${
        (theme.colors?.logo?.replace("#", "?color=") ?? "") + (theme.light ? "&invert" : "")
      }">
      <span class="name">${theme.name}</span>
      <div class="theme-author">by <span>${theme.author}</span></div>
      <input type="radio" name="theme" value="${themeName}" ${selected ? "checked" : ""}>
    `;
  }
}

/**
 * removes any theme buttons not in the list
 *
 * @param allowedThemes list of theme names that should not be removed
 */
function removeExtraButtons(allowedThemes: string[]) {
  themesBox?.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach((radio: HTMLInputElement) => {
    if (radio.value.startsWith("themer-") && !allowedThemes.includes(radio.value)) {
      radio.parentElement?.remove();
    }
  });
}

window.postMessage(
  {
    message: "ready",
  },
  "*"
);

console.log("SkyCrypt Themer successfully injected");
