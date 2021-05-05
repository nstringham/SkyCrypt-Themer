export interface Storage {
  themes?: Themes;
}

export interface Themes {
  [key: string]: Theme;
}

export interface Theme {
  name: string;
  author: string;
  official?: true;
  community?: true;
  light?: true;
  images?: Images;
  backgrounds?: Backgrounds;
  colors?: Colors;
}

export type Images = {
  [key in ImageName]?: ImageUrl;
};

export enum ImageName {
  bg = "bg",
  bgBlur = "bg_blur",
}

export type ImageUrl = string;

export type Backgrounds = {
  [key in BackgroundName]?: Background;
};

export enum BackgroundName {
  skillBar = "skillbar",
  maxedBar = "maxedbar",
}

export type Background =
  | {
      type: "color";
      color: Color;
    }
  | {
      type: "stripes";
      angle: string;
      colors: Color[];
      width: number;
    };

export type Colors = {
  [key in ColorName]?: Color;
};

export enum ColorName {
  logo = "logo",
  icon = "icon",
  link = "link",
  hover = "hover",
  maxed = "maxed",
  gold = "gold",
}

export type Color = string;

export const defaultTheme = {
  name: "Default Theme",
  author: "SkyCrypt Team",
  official: true,
  images: {
    bg: "/resources/img/bg.webp?v3",
    bg_blur: "/resources/img/bg_blur.webp?v3",
  },
  backgrounds: {
    skillbar: { type: "color", color: "#0baa51" },
    maxedbar: { type: "color", color: "#ce8f12" },
  },
  colors: {
    logo: "#0bda51",
    icon: "#0BCA51",
    link: "#0BEA51",
    hover: "#09EF70",
    maxed: "#DD980E",
    gold: "#FDBB3C",
  },
};

export function hexToRGB(hex: Color): string {
  return [parseInt(hex[1] + hex[2], 16), parseInt(hex[3] + hex[4], 16), parseInt(hex[5] + hex[6], 16)].join(", ");
}
