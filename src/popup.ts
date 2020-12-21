import { Themes } from "./common";
import { ThemeForm } from "./themeForm";

const themeButton = document.getElementById('use-theme') as HTMLButtonElement;

const themeForms: { [key: string]: ThemeForm } = {};

const form = document.querySelector('form') as HTMLFormElement;

chrome.storage.sync.get('themes', (result) => {
    if (result.themes) {
        const id = 'themer'
        themeForms[id] = new ThemeForm(form, result.themes?.[id], id);
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

themeButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "switch-theme", theme: 'themer' });
        }
    });
})

console.log(themeForms)