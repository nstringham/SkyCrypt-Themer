export interface Theme {
    name: string,
    author: string,
    official: boolean,
    logo: "../img/logo_square.svg",
    backgrounds?: {
        bg?: {
            png?: "../img/bg.png?v3",
            webp?: "../img/bg.webp?v3"
        },
        bg_blur?: {
            webp?: "../img/bg_blur.webp?v3"
        }
    },
    colors?: {
        icon?: "#0BCA51",
        line?: "#0BDA51",
        link?: "#0BEA51",
        hover?: "#09EF70",
        maxed?: "#DD980E",
        gold?: "#FDBB3C",
        skillbar?: "#0BAA51",
        maxedbar?: "#CE8F12"
    }
}