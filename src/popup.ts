import { Themes } from "./common";
import { ThemeForm } from "./themeForm";

const themeForms: { [key: string]: ThemeForm } = {};

const form = document.querySelector('form') as HTMLFormElement;

chrome.storage.sync.get('themes', (result) => {
    if (result.themes) {
        const id = 'themer';
        themeForms[id] = new ThemeForm(form, result.themes?.[id], id);
    }
});

form.addEventListener("change", updateThemes);

form.addEventListener('submit', event => {
    updateThemes();
    event.preventDefault();
});

function updateThemes() {
    const themes: Themes = {};
    for (const key in themeForms) {
        themes[key] = themeForms[key].theme;
    }
    chrome.storage.sync.set({
        themes
    });

}

console.log(themeForms);