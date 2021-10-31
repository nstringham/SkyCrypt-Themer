import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import typescript from "@rollup/plugin-typescript";

import { chromeExtension, simpleReloader } from "rollup-plugin-chrome-extension";
import { emptyDir } from "rollup-plugin-empty-dir";
import { terser } from "rollup-plugin-terser";
import zip from "rollup-plugin-zip";

const isProduction = process.env.NODE_ENV === "production";

export default {
  input: "src/manifest.json",
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: !isProduction,
  },
  plugins: [
    chromeExtension(),
    simpleReloader(),
    resolve(),
    commonjs(),
    typescript(),
    emptyDir(),
    isProduction && terser(),
    isProduction && zip({ dir: "releases" }),
  ],
};
