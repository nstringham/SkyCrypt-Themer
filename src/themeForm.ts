import { Theme } from "./common";

export class ThemeForm {

    nameField: HTMLInputElement;
    authorField: HTMLInputElement;
    bgField: HTMLInputElement;
    bgBlurField: HTMLInputElement;

    constructor(element, value) {
        this.nameField = element.querySelector("#name");
        this.authorField = element.querySelector("#author");
        this.bgField = element.querySelector("#bg");
        this.bgBlurField = element.querySelector("#bg_blur");
        this.theme = value;
    }

    get theme(): Theme {
        return {
            name: this.nameField.value,
            author: this.authorField.value,
            official: false,
            logo: "../img/logo_square.svg",
            backgrounds: {
                bg: this.bgField.value.length ? { webp: this.bgField.value } : undefined,
                bg_blur: this.bgBlurField.value.length ? { webp: this.bgBlurField.value } : undefined
            },
            colors: {
                icon: "#0BCA51",
                line: "#0BDA51",
                link: "#0BEA51",
                hover: "#09EF70",
                maxed: "#DD980E",
                gold: "#FDBB3C",
                skillbar: "#0BAA51",
                maxedbar: "#CE8F12"
            }
        }
    }

    set theme(value: Theme) {
        this.nameField.value = value?.name || ''
        this.authorField.value = value?.author || ''
        this.bgField.value = value?.backgrounds?.bg?.webp || ''
        this.bgBlurField.value = value?.backgrounds?.bg_blur?.webp || ''
    }
}