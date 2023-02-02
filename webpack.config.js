// eslint-disable-next-line flowtype/require-valid-file-annotation
const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const ROOT = process.cwd();

module.exports = {
  mode: "production",
  entry: {
    app: path.join(__dirname, "src/index.js"),
    worker: path.join(__dirname, "src/worker.js"),
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].min.js",
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ESLintPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(ROOT, "/public/index.html"),
    }),
  ],
};
