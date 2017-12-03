import webpack from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';
import webpackClientConfig from './webpack.client.config';

export const CLIENT_MANIFEST_FILE_NAME = 'manifest.json';

export default {
  ...webpackClientConfig,
  plugins: [
    ...webpackClientConfig.plugins,
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
