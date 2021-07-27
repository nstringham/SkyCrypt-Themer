const scriptElement = document.createElement("script");
scriptElement.type = "module";
scriptElement.src = chrome.runtime.getURL("injectable.js");
document.documentElement.prepend(scriptElement);
