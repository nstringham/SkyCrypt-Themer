export class ThemeForm {

    nameField;
    bgField;
    bgBlurField;

    constructor(element, value) {
        this.nameField = element.querySelector("#name");
        this.bgField = element.querySelector("#bg");
        this.bgBlurField = element.querySelector("#bg_blur");
        this.theme = value;
    }

    get theme() {
        return {
            name: this.nameField.value,
            author: "SkyCrypt Team",
            official: true,
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

    set theme(value) {
        this.nameField.value = value?.name || "Themer Theme"
        this.bgField.value = value?.backgrounds?.bg?.webp || ''
        this.bgBlurField.value = value?.backgrounds?.bg?.webp_blur || ''
    }
}