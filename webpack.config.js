/* eslint-disable */
const { join } = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

let package = require("./package.json");
function insertVersion(content) {
  var manifest = JSON.parse(content.toString());
  manifest.version = package.version;
  return JSON.stringify(manifest);
}

/** @type {()=>import("webpack").Configuration} */
module.exports = (env, argv) => ({
  mode: process.env.NODE_ENV,
  devtool: argv.mode === "development" ? "inline-source-map" : undefined,
  entry: {
    contentScript: join(__dirname, "src/contentScript.ts"),
    contentScriptStart: join(__dirname, "src/contentScriptStart.ts"),
    background: join(__dirname, "src/background.ts"),
    injectable: join(__dirname, "src/injectable.ts"),
    popup: join(__dirname, "src/popup.ts"),
  },
  output: {
    path: join(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        include: /src/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  experiments: { topLevelAwait: true },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: "./src/assets",
          to: "assets",
        },
        {
          from: "./src/manifest.json",
          transform(content, absoluteFrom) {
            return insertVersion(content);
          },
        },
      ],
    }),
    new ESLintPlugin({
      extensions: ["ts"],
    }),
    new HtmlWebpackPlugin({
      filename: "popup.html",
      template: "src/popup.ejs",
      inject: false,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
});
