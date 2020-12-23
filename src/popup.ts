import { Theme, Themes, Storage } from "./common";
import { ThemeForm } from "./themeForm";
import "./popup.scss";
import "@material/mwc-button";
import "@material/mwc-textfield";
import "@material/mwc-icon-button";

let port: chrome.runtime.Port;

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0].id) {
    port = chrome.tabs.connect(tabs[0].id);
  }
});

const themeForms: { [key: string]: ThemeForm } = {};

const formTemplate = document.querySelector(
  "template#theme-form"
) as HTMLTemplateElement;
const themesContainer = document.querySelector(
  "#themes-container"
) as HTMLElement;

function createThemeForm(id: string, initialValue?: Theme) {
  const fragment = formTemplate.content.cloneNode(true) as DocumentFragment;
  (fragment.firstElementChild as HTMLFormElement).id = id;
  themesContainer.appendChild(fragment);

  const form = themesContainer.querySelector(`form#${id}`) as HTMLFormElement;

  form.querySelector("#delete-theme")?.addEventListener("click", () => {
    if (confirm("are you sure?")) {
      delete themeForms[id];
      form.remove();
    }
  });

  themeForms[id] = new ThemeForm(
    form,
    id,
    port,
    initialValue
  );
}

chrome.storage.sync.get("themes", (result: Storage) => {
  if (result.themes) {
    for (const id in result.themes) {
      createThemeForm(id, result.themes[id]);
    }
  }
});

document.querySelectorAll("#new-theme").forEach((element) => {
  element.addEventListener("click", () => {
    const id = prompt("what id?");
    if (id) {
      createThemeForm(id);
    }
  });
});

themesContainer.addEventListener("change", setThemes);

themesContainer.addEventListener("submit", (event) => {
  setThemes();
  event.preventDefault();
});

function setThemes() {
  const themes: Themes = {};
  for (const key in themeForms) {
    themes[key] = themeForms[key].theme;
  }
  chrome.storage.sync.set({
    themes,
  });
}

console.log(themeForms);
