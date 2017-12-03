import fs from 'fs';
import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export const APP_PATH = fs.realpathSync(process.cwd());
export const SRC_PATH = path.join(APP_PATH, 'src');
export const APP_ENTRY = path.join(SRC_PATH, 'main.js');
export const NODE_MODULES_PATH = path.join(APP_PATH, 'node_modules');
export const BUILD_PATH = path.join(APP_PATH, 'build', 'client');
export const PUBLIC_PATH = '/assets/';

export const JS_INCLUDES = [
  SRC_PATH,
];

export default {
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
  ],
  devtool: 'cheap-module-eval-source-map',
};
