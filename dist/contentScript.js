'use strict';
const scriptElement = document.createElement('script');
scriptElement.src = chrome.runtime.getURL('pageScript.js');
document.head.appendChild(scriptElement);

function sendThemes(themes) {
    window.postMessage({
        type: "set-themes",
        themes
    }, "https://sky.shiiyu.moe");
}

function switchTheme(theme) {
    window.postMessage({
        type: "switch-theme",
        theme
    }, "https://sky.shiiyu.moe");
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {

        if (changes.themes) {
            sendThemes(changes.themes.newValue);
        }

        if (changes.theme) {
            switchTheme(changes.theme.newValue)
        }
    }
});

window.addEventListener("message", (event) => {
    if (event.source == window && event.data?.message == "ready") {

        chrome.storage.sync.get(['themes', 'theme'], (result) => {
            if (result.themes) {
                sendThemes(result.themes)
            }
            if (result.theme) {
                switchTheme(result.theme)
            }
        });

    }
});

