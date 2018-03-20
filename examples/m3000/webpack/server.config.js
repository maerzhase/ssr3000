var fs = require('fs');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

var APP_PATH = fs.realpathSync(process.cwd());
var SRC_PATH = path.join(APP_PATH, 'src');
var APP_ENTRY = path.join(SRC_PATH, 'serverMiddleware', 'index.js');
var NODE_MODULES_PATH = path.join(APP_PATH, 'node_modules');
var BUILD_PATH = path.join(APP_PATH, 'build', 'server');
var BUILD_FILE_NAME = 'bundle.js';
var PUBLIC_PATH = '/assets/';

var BUILD_FILE = path.join(
  BUILD_PATH,
  BUILD_FILE_NAME,
);

var JS_INCLUDES = [
  SRC_PATH,
];

module.exports = {
  mode: 'development',
  entry: [
    APP_ENTRY,
  ],
  target: 'node',
  output: {
    path: BUILD_PATH,
    filename: BUILD_FILE_NAME,
    publicPath: PUBLIC_PATH,
    libraryTarget: 'commonjs2',
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ejs$/,
        loader: 'raw-loader',
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        include: JS_INCLUDES,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        include: JS_INCLUDES,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['build/server']),
  ],
  devtool: 'cheap-module-eval-source-map',
};
