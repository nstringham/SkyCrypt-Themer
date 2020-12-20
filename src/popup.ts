import { Themes } from "./common";
import { ThemeForm } from "./themeForm";

const themeField = document.getElementById('theme') as HTMLInputElement;

const themeForms: { [key: string]: ThemeForm } = {};

chrome.storage.sync.get(['themes', 'theme'], (result) => {
    if (result.themes) {
        themeForms.themer = new ThemeForm(document.querySelector('form'), result.themes?.themer);
    }
    if (result.theme) {
        themeField.value = result.theme;
    }
});

document.querySelector('form').addEventListener("change", () => {
    const themes: Themes = {}
    for (const key in themeForms) {
        themes[key] = themeForms[key].theme;
    }
    chrome.storage.sync.set({
        theme: themeField.value,
        themes
    });
});

console.log(themeForms)