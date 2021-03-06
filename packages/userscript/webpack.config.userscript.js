/* eslint-disable @typescript-eslint/no-var-requires */

const isDevBuild = process.env.NODE_ENV === "development";
const path = require("path");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackUserscript = require("webpack-userscript");

module.exports = {
  entry: path.resolve(__dirname, "source", "index.ts"),
  mode: isDevBuild ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: require.resolve("ts-loader"),
        options: PnpWebpackPlugin.tsLoaderOptions(),
      },
    ],
  },
  optimization: {
    minimize: !isDevBuild,
    minimizer: [new TerserPlugin()],
  },
  output: {
    path: path.resolve(__dirname, "bundle"),
    filename: `kitten-scientists${isDevBuild ? "-dev" : ""}.user.js`,
  },
  plugins: [
    new WebpackUserscript({
      headers: {
        match: [
          "*bloodrizer.ru/games/kittens/*",
          "*kittensgame.com/alpha/*",
          "*kittensgame.com/beta/*",
          "*kittensgame.com/web/*",
          "file:///*kitten-game*",
        ],
        name: "Kitten Scientists",
      },
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [PnpWebpackPlugin],
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
};
