const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const developmentConfig = require('./config/development.json');
const productionConfig = require('./config/production.json');

// we should change this so isProduction is only true if NODE_ENV='production'
// leaving it like this for now because we're used to prod being the default
// and it'd be easy to accidentally release a dev build
const isProduction = process.env.NODE_ENV !== 'development';

module.exports = {
  devServer: {
    port: 3000,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
    new MiniCSSExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'static', '**/*'), to: path.join(__dirname, '../web') },
    ]),
    new MonacoWebpackPlugin({
      // See options at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['lua'],
    }),
    // inject some config variables into the bundle
    new webpack.DefinePlugin({
      config: JSON.stringify(isProduction ? productionConfig : developmentConfig),
    }),
  ],
  output: {
    path: path.join(__dirname, '../web'),
  },
};
