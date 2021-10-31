import { Theme, Themes, Storage } from "./common";
import { ThemeForm } from "./themeForm";
import "@material/mwc-button";
import "@material/mwc-textfield";
import "@material/mwc-icon-button";
import "@material/mwc-select";
import "@material/mwc-list/mwc-list-item";
import "@material/mwc-dialog";
import { asyncConfirm } from "./dialog";

let port: chrome.runtime.Port;

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0].id) {
    port = chrome.tabs.connect(tabs[0].id);
  }
});

const themeForms: { [key: string]: ThemeForm } = {};

const formTemplate = document.querySelector("template#theme-form") as HTMLTemplateElement;
const themesContainer = document.querySelector("#themes-container") as HTMLElement;

function createThemeForm(initialValue?: Theme, id?: string) {
  if (!id) {
    id = "themer-" + Date.now().toString(36);
  }
  const fragment = formTemplate.content.cloneNode(true) as DocumentFragment;
  (fragment.firstElementChild as HTMLFormElement).id = id;
  themesContainer.appendChild(fragment);

  const form = themesContainer.querySelector(`form#${id}`) as HTMLFormElement;

  const deletionCallback = () => {
    const themeName = themeForms[id as string].theme.name;
    asyncConfirm(
      "Delete Theme?",
      `are you sure you want to permanently delete ${themeName || "this theme"} form all your synced devices?`,
      "Delete"
    ).then((isSure) => {
      if (isSure) {
        delete themeForms[id as string];
        form.remove();
        setThemes();
      }
    });
  };

  themeForms[id] = new ThemeForm(form, id, port, deletionCallback, initialValue);
}

chrome.storage.sync.get("themes", (result: Storage) => {
  if (result.themes) {
    for (const id in result.themes) {
      createThemeForm(result.themes[id], id);
    }
  }
});

document.querySelectorAll("#new-theme").forEach((element) => {
  element.addEventListener("click", () => {
    createThemeForm();
  });
});

document.querySelectorAll("#import-theme").forEach((element) => {
  element.addEventListener("click", async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      const contents = await file.text();
      createThemeForm(JSON.parse(contents));
      setThemes();
    } catch (error) {
      console.error(error);
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
