var fs = require('fs');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');

var CLIENT_MANIFEST_FILE_NAME = 'manifest.json';

var APP_PATH = fs.realpathSync(process.cwd());
var SRC_PATH = path.join(APP_PATH, 'src');
var APP_ENTRY = path.join(SRC_PATH, 'main.js');
var NODE_MODULES_PATH = path.join(APP_PATH, 'node_modules');
var BUILD_PATH = path.join(APP_PATH, 'build', 'client');
var PUBLIC_PATH = '/assets/';

var JS_INCLUDES = [
  SRC_PATH,
];

module.exports = {
  entry: [
    APP_ENTRY,
  ],
  target: 'web',
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js',
    publicPath: PUBLIC_PATH,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        include: JS_INCLUDES,
        loader: 'eslint-loader',
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.js$/,
        include: JS_INCLUDES,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    ],
  },
  resolve: {
    modules: [
      NODE_MODULES_PATH,
      'node_modules',
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['build/client']),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false,
        comparisons: false,  // don't optimize comparisons
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
      sourceMap: true,
    }),
    new ManifestPlugin({
      fileName: CLIENT_MANIFEST_FILE_NAME,
    }),
  ],
  devtool: 'source-map',
};
