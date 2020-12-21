import { Themes } from "./common";
import { ThemeForm } from "./themeForm";

const themeField = document.getElementById('theme') as HTMLInputElement;

const themeForms: { [key: string]: ThemeForm } = {};

const form = document.querySelector('form') as HTMLFormElement;

chrome.storage.sync.get('themes', (result) => {
    if (result.themes) {
        themeForms.themer = new ThemeForm(form, result.themes?.themer);
    }
});

form.addEventListener("change", () => {
    const themes: Themes = {}
    for (const key in themeForms) {
        themes[key] = themeForms[key].theme;
    }
    chrome.storage.sync.set({
        themes
    });
});

console.log(themeForms)