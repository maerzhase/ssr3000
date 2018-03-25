import CleanWebpackPlugin from 'clean-webpack-plugin';
import {
  APP_PATH,
  CLIENT_ENTRY,
  NODE_MODULES_PATH,
  CLIENT_BUILD_PATH,
  PUBLIC_PATH,
  JS_INCLUDES,
} from './constants';

export default {
  mode: 'development',
  target: 'web',
  entry: [
    CLIENT_ENTRY,
  ],
  output: {
    path: CLIENT_BUILD_PATH,
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
          presets: [
            'env',
            'stage-3',
            'react',
          ],
          plugins: [
            'transform-runtime',
            'transform-decorators-legacy',
            'transform-class-properties',
            'react-hot-loader/babel',
          ],
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
    new CleanWebpackPlugin(
      [CLIENT_BUILD_PATH],
      { root: APP_PATH },
    ),
  ],
  devtool: 'cheap-module-eval-source-map',
};
