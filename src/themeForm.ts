import {
  Theme,
  defaultTheme,
  ThemeColors,
  ThemeColorName,
  hexToRGB,
} from "./common";

export class ThemeForm {
  private nameField: HTMLInputElement;
  private authorField: HTMLInputElement;
  private logoField: HTMLInputElement;
  private bgField: HTMLInputElement;
  private bgBlurField: HTMLInputElement;
  private colorFields: { [key: string]: HTMLInputElement } = {};

  constructor(
    element: HTMLElement,
    private id: string,
    private port: chrome.runtime.Port,
    deletionCallback: () => void,
    value?: Theme
  ) {
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
      this.colorFields[colorName].addEventListener("input", () => {
        const value = this.colorFields[colorName].value;
        this.port.postMessage({
          type: "set-styles",
          styles: {
            [`--${colorName}-hex`]: value,
            [`--${colorName}-rgb`]: hexToRGB(value),
          },
        });
      });
    }

    element.querySelector("#use-theme")?.addEventListener("click", () => {
      this.port.postMessage({
        type: "switch-theme",
        theme: id,
      });
    });

    element
      .querySelector("#delete-theme")
      ?.addEventListener("click", () => deletionCallback());

    element
      .querySelector("#export-theme")
      ?.addEventListener("click", () => this.saveFile());

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

  public async saveFile(): Promise<void> {
    const fileHandle = await window.showSaveFilePicker({
      types: [
        {
          description: "SkyCrypt Theme JSON",
          accept: {
            "application/json": [".json"],
          },
        },
      ],
    });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(this.theme));
    await writable.close();
  }
}
