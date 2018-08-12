import CleanWebpackPlugin from 'clean-webpack-plugin';
import {
  APP_PATH,
  NODE_MODULES_PATH,
  CLIENT_BUILD_PATH,
  PUBLIC_PATH,
  JS_INCLUDES,
  SSR3000_LIB,
  SRR3000_DEFAULT_RENDER,
  CLIENT_RENDER,
  ALL_ENTRIES,
} from './constants';

export default {
  mode: 'development',
  target: 'web',
  entry: {
    [CLIENT_RENDER]: SRR3000_DEFAULT_RENDER,
    ...ALL_ENTRIES,
  },
  output: {
    library: [SSR3000_LIB, '[name]'],
    path: CLIENT_BUILD_PATH,
    filename: `${SSR3000_LIB}.[name].js`,
    publicPath: PUBLIC_PATH,
    libraryTarget: 'umd',
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
      {
        include: JS_INCLUDES,
        loader: 'react-hot-loader-loader',
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
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
