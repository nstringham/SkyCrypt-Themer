import { ThemeForm } from "./themeForm.js";

const themeField = document.getElementById('theme')

const themeForms = {
    themer: {}
}

chrome.storage.sync.get(['themes', 'theme'], (result) => {
    if (result.themes) {
        themeForms.themer = new ThemeForm(document.querySelector('form'), result.themes.themer);
    }
    if (result.theme) {
        themeField.value = result.theme;
    }
});

document.querySelector('form').addEventListener("change", () => {
    const themes = {}
    for (const key in themeForms) {
        themes[key] = themeForms[key].theme;
    }
    chrome.storage.sync.set({
        theme: themeField.value,
        themes
    });
});

console.log(themeForms)