const startingTheme = localStorage.getItem('currentTheme');
if (startingTheme) {
    chrome.storage.sync.get('themes', (result) => {
        if (result.themes?.[startingTheme]) {
            window.addEventListener("message", (event) => {
                if (event.source === window && event.data?.message === "ready") {
                    localStorage.setItem('currentTheme', startingTheme);
                }
            });
        }
    });
}