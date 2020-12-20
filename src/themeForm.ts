import { Theme, defaultTheme, ThemeColors } from "./common";

export class ThemeForm {

    nameField: HTMLInputElement;
    authorField: HTMLInputElement;
    bgField: HTMLInputElement;
    bgBlurField: HTMLInputElement;
    colorFields: { [key: string]: HTMLInputElement } = {};

    constructor(element: HTMLElement, value: Theme) {
        this.nameField = element.querySelector("#name");
        this.authorField = element.querySelector("#author");
        this.bgField = element.querySelector("#bg");
        this.bgBlurField = element.querySelector("#bg-blur");
        for (const colorName in defaultTheme.colors) {
            this.colorFields[colorName] = element.querySelector(`#${colorName}-color`);
            element.querySelector<HTMLButtonElement>(`#${colorName}-default`).addEventListener('click', () => {
                this.colorFields[colorName].value = defaultTheme.colors[colorName]
            })
        }
        this.theme = value;
    }

    get theme(): Theme {
        const colors: ThemeColors = {};
        for (const colorName in defaultTheme.colors) {
            if (this.colorFields[colorName].value !== defaultTheme.colors[colorName]) {
                colors[colorName] = this.colorFields[colorName].value;
            }
        }
        return {
            name: this.nameField.value,
            author: this.authorField.value,
            official: false,
            logo: "../img/logo_square.svg",
            backgrounds: {
                bg: this.bgField.value.length ? { webp: this.bgField.value } : undefined,
                bg_blur: this.bgBlurField.value.length ? { webp: this.bgBlurField.value } : undefined
            },
            colors
        }
    }

    set theme(value: Theme) {
        this.nameField.value = value?.name || ''
        this.authorField.value = value?.author || ''
        this.bgField.value = value?.backgrounds?.bg?.webp || ''
        this.bgBlurField.value = value?.backgrounds?.bg_blur?.webp || ''
        for (const key in defaultTheme.colors) {
            this.colorFields[key].value = value?.colors?.[key] || defaultTheme.colors[key]
        }
    }
}