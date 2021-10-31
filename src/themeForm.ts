import { Theme, defaultTheme, Colors, ColorName, hexToRGB, BackgroundName, Backgrounds, Color } from "./common";

import "./elements/color-input";
export class ThemeForm {
  private nameField: HTMLInputElement;
  private authorField: HTMLInputElement;
  private bgField: HTMLInputElement;
  private lightField: HTMLSelectElement;
  private colorFields: { [key: string]: HTMLInputElement } = {};
  private backgroundFields: { [key: string]: HTMLInputElement } = {};

  constructor(
    element: HTMLElement,
    private id: string,
    private port: chrome.runtime.Port,
    deletionCallback: () => void,
    value?: Theme
  ) {
    this.nameField = element.querySelector("#name") as HTMLInputElement;
    this.authorField = element.querySelector("#author") as HTMLInputElement;
    this.bgField = element.querySelector("#bg") as HTMLInputElement;
    this.lightField = element.querySelector("#light") as HTMLSelectElement;
    for (const backgroundName in defaultTheme.backgrounds) {
      this.backgroundFields[backgroundName] = element.querySelector(
        `color-input[color-name="${backgroundName}"]`
      ) as HTMLInputElement;
      this.backgroundFields[backgroundName].addEventListener("input", () => {
        const value = this.backgroundFields[backgroundName].value;
        this.port.postMessage({
          type: "set-styles",
          styles: {
            [`--${backgroundName}`]: value,
          },
        });
      });
    }
    for (const colorName in defaultTheme.colors) {
      this.colorFields[colorName] = element.querySelector(`color-input[color-name="${colorName}"]`) as HTMLInputElement;
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

    element.querySelector("#delete-theme")?.addEventListener("click", () => deletionCallback());

    element.querySelector("#export-theme")?.addEventListener("click", () => this.saveFile());

    this.theme = value || { name: "", author: "", community: true };
  }

  get theme(): Theme {
    const backgrounds: Backgrounds = {};
    for (const backgroundName in defaultTheme.backgrounds) {
      if (
        this.backgroundFields[backgroundName].value !==
        defaultTheme.backgrounds[backgroundName as BackgroundName].color.toLocaleLowerCase()
      ) {
        backgrounds[backgroundName as BackgroundName] = {
          type: "color",
          color: this.backgroundFields[backgroundName].value,
        };
      }
    }
    const colors: Colors = {};
    for (const colorName in defaultTheme.colors) {
      if (this.colorFields[colorName].value !== defaultTheme.colors[colorName as ColorName].toLocaleLowerCase()) {
        colors[colorName as ColorName] = this.colorFields[colorName].value;
      }
    }
    return {
      name: this.nameField.value,
      author: this.authorField.value,
      community: true,
      light: this.lightField.value === "light" || undefined,
      images: {
        bg: this.bgField.value.length ? this.bgField.value : undefined,
      },
      backgrounds,
      colors,
    };
  }

  set theme(value: Theme) {
    this.nameField.value = value?.name;
    this.authorField.value = value?.author;
    this.bgField.value = value?.images?.bg || "";
    this.lightField.value = value.light ? "light" : "dark";
    for (const backgroundName in defaultTheme.backgrounds) {
      this.backgroundFields[backgroundName].value =
        value?.backgrounds?.[backgroundName as BackgroundName]?.type === "color"
          ? (value.backgrounds[backgroundName as BackgroundName] as { color: Color }).color
          : defaultTheme.backgrounds[backgroundName as BackgroundName].color;
    }
    for (const colorName in defaultTheme.colors) {
      this.colorFields[colorName].value =
        value?.colors?.[colorName as ColorName] ?? defaultTheme.colors[colorName as ColorName];
    }
  }

  public async saveFile(): Promise<void> {
    try {
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
    } catch (error) {
      console.error(error);
    }
  }
}
