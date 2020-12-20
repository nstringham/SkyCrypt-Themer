export interface Theme {
    name: string,
    author: string,
    official: boolean,
    logo: ImageUrl,
    backgrounds?: {
        bg?: {
            png?: ImageUrl,
            webp?: ImageUrl
        },
        bg_blur?: {
            webp?: ImageUrl
        }
    },
    colors?: ThemeColors
}

export interface ThemeColors {
    icon?: Color,
    line?: Color,
    link?: Color,
    hover?: Color,
    maxed?: Color,
    gold?: Color,
    skillbar?: Color,
    maxedbar?: Color
}

type Color = string

type ImageUrl = string