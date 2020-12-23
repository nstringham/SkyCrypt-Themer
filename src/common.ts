export interface Storage {
  themes?: Themes;
}

export interface Themes {
  [key: string]: Theme;
}

export interface Theme {
  name: string;
  author: string;
  official: boolean;
  logo: ImageUrl;
  backgrounds?: {
    bg?: {
      png?: ImageUrl;
      webp?: ImageUrl;
    };
    bg_blur?: {
      webp?: ImageUrl;
    };
  };
  colors?: ThemeColors;
}

export interface ThemeColors {
  icon?: Color;
  line?: Color;
  link?: Color;
  hover?: Color;
  maxed?: Color;
  gold?: Color;
  skillbar?: Color;
  maxedbar?: Color;
}

export type ThemeColorName = "icon" | "line" | "link" | "hover" | "maxed" | "gold" | "skillbar" | "maxedbar";

export type Color = string;

export type ImageUrl = string;

export const defaultTheme = {
  name: "Default Theme",
  author: "SkyCrypt Team",
  official: true,
  logo: "../img/logo_square.svg",
  backgrounds: {
    bg: {
      png: "../img/bg.png?v3",
      webp: "../img/bg.webp?v3",
    },
    bg_blur: {
      webp: "../img/bg_blur.webp?v3",
    },
  },
  colors: {
    icon: "#0BCA51",
    line: "#0BDA51",
    link: "#0BEA51",
    hover: "#09EF70",
    maxed: "#DD980E",
    gold: "#FDBB3C",
    skillbar: "#0BAA51",
    maxedbar: "#CE8F12",
  },
};

export function hexToRGB(hex: Color): string {
  return [parseInt(hex[1] + hex[2], 16), parseInt(hex[3] + hex[4], 16), parseInt(hex[5] + hex[6], 16)].join(", ");
}
