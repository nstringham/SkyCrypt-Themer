import { Theme, defaultTheme, ThemeColors, ThemeColorName } from "./common";

export class ThemeForm {
  private nameField: HTMLInputElement;
  private authorField: HTMLInputElement;
  private logoField: HTMLInputElement;
  private bgField: HTMLInputElement;
  private bgBlurField: HTMLInputElement;
  private colorFields: { [key: string]: HTMLInputElement } = {};

  constructor(element: HTMLElement, private id: string, value?: Theme) {
    this.nameField = element.querySelector("#name") as HTMLInputElement;
    this.authorField = element.querySelector("#author") as HTMLInputElement;
    this.logoField = element.querySelector("#logo") as HTMLInputElement;
    this.bgField = element.querySelector("#bg") as HTMLInputElement;
    this.bgBlurField = element.querySelector("#bg-blur") as HTMLInputElement;
    for (const colorName in defaultTheme.colors) {
      this.colorFields[colorName] = element.querySelector(
        `#${colorName}-color`
      ) as HTMLInputElement;
      element
        .querySelector(`#${colorName}-default`)
        ?.addEventListener("click", () => {
          this.colorFields[colorName].value =
            defaultTheme.colors[colorName as ThemeColorName];
          this.colorFields[colorName].dispatchEvent(
            new Event("input", { bubbles: true })
          );
        });
    }
    element.querySelector("#use-theme")?.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "switch-theme",
            theme: this.id,
          });
        }
      });
    });
    this.theme = value || { name: "", author: "", official: false, logo: "" };
  }

  get theme(): Theme {
    const colors: ThemeColors = {};
    for (const colorName in defaultTheme.colors) {
      if (
        this.colorFields[colorName].value !==
        defaultTheme.colors[colorName as ThemeColorName].toLocaleLowerCase()
      ) {
        colors[colorName as ThemeColorName] = this.colorFields[colorName].value;
      }
    }
    return {
      name: this.nameField.value,
      author: this.authorField.value,
      official: false,
      logo: this.logoField.value,
      backgrounds: {
        bg: this.bgField.value.length
          ? { webp: this.bgField.value }
          : undefined,
        bg_blur: this.bgBlurField.value.length
          ? { webp: this.bgBlurField.value }
          : undefined,
      },
      colors,
    };
  }

  set theme(value: Theme) {
    this.nameField.value = value?.name;
    this.authorField.value = value?.author;
    this.logoField.value = value?.logo;
    this.bgField.value = value?.backgrounds?.bg?.webp || "";
    this.bgBlurField.value = value?.backgrounds?.bg_blur?.webp || "";
    for (const colorName in defaultTheme.colors) {
      this.colorFields[colorName].value =
        value?.colors?.[colorName as ThemeColorName] ||
        defaultTheme.colors[colorName as ThemeColorName];
    }
  }
}
