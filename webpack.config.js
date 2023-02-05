const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    app: path.join(__dirname, 'src/index.js'),
    worker: path.join(__dirname, 'src/worker.js'),
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].min.js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.IMAGE_PATH': JSON.stringify(process.env.IMAGE_PATH),
      'process.env.TILE_SIZE': JSON.stringify(process.env.TILE_SIZE || '10'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
  ],
};
