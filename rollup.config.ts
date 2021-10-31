import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import typescript from "@rollup/plugin-typescript";

import { chromeExtension, simpleReloader } from "rollup-plugin-chrome-extension";
import { emptyDir } from "rollup-plugin-empty-dir";
import { terser } from "rollup-plugin-terser";
import minifyHTML from "rollup-plugin-minify-html-literals";
import zip from "rollup-plugin-zip";

const isProduction = process.env.NODE_ENV === "production";

export default {
  input: "src/manifest.json",
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: isProduction ? false : "inline",
  },
  plugins: [
    chromeExtension(),
    simpleReloader(),
    resolve(),
    commonjs(),
    typescript(),
    emptyDir(),
    isProduction && terser(),
    isProduction &&
      minifyHTML({
        options: {
          minifyOptions: {
            conservativeCollapse: true,
          },
        },
      }),
    isProduction && zip({ dir: "releases" }),
  ],
};
