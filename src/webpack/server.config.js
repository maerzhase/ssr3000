import fs from 'fs';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { conditionalPlugin } from '../webpack/utils';
import {
  APP_PATH,
  SERVER_BUILD_PATH,
  PUBLIC_PATH,
  JS_INCLUDES,
  STATIC_ASSETS_DIR_IN,
  STATIC_ASSETS_DIR_OUT,
  SSR3000_LIB,
  ALL_ENTRIES,
} from './constants';

export default {
  mode: 'development',
  target: 'node',
  entry: {
    ...ALL_ENTRIES
  },
  output: {
    library: [SSR3000_LIB, '[name]'],
    path: SERVER_BUILD_PATH,
    filename: `${SSR3000_LIB}.[name].js`,
    publicPath: PUBLIC_PATH,
    libraryTarget: 'commonjs2',
  },
  externals: [
    nodeExternals(),
  ],
  module: {
    rules: [
      {
        test: /\.ejs$/,
        loader: 'raw-loader',
      },
      {
        test: /\.js$/,
        include: JS_INCLUDES,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
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
  plugins: [
    new CleanWebpackPlugin(
      [SERVER_BUILD_PATH],
      {
        root: APP_PATH,
        verbose: false,
      },
    ),
    new CleanWebpackPlugin(
      [STATIC_ASSETS_DIR_OUT],
      {
        root: APP_PATH,
        watch: true,
      },
    ),
    ...conditionalPlugin(
      fs.existsSync(STATIC_ASSETS_DIR_IN),
      new CopyWebpackPlugin([
        {
          from: STATIC_ASSETS_DIR_IN,
          to: STATIC_ASSETS_DIR_OUT,
        },
      ], {
        copyUnmodified: true,
      }),
    ),
  ],
  devtool: 'inline-cheap-source-map',
};
