import fs from 'fs';
import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import nodeExternals from 'webpack-node-externals';

export const APP_PATH = fs.realpathSync(process.cwd());
export const SRC_PATH = path.join(APP_PATH, 'src');
export const APP_ENTRY = path.join(SRC_PATH, 'serverMiddleware', 'index.js');
export const NODE_MODULES_PATH = path.join(APP_PATH, 'node_modules');
export const BUILD_PATH = path.join(APP_PATH, 'build', 'server');
export const BUILD_FILE_NAME = 'bundle.js';
export const PUBLIC_PATH = '/assets/';

export const BUILD_FILE = path.join(
  BUILD_PATH,
  BUILD_FILE_NAME,
);

export const JS_INCLUDES = [
  SRC_PATH,
];

export default {
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
