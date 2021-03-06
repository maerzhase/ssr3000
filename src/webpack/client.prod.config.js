import webpack from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';
import clientConfig from './client.config';

const CLIENT_MANIFEST_FILE_NAME = 'manifest.json';

export default {
  ...clientConfig,
  mode: 'production',
  plugins: [
    ...clientConfig.plugins,
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new ManifestPlugin({
      fileName: CLIENT_MANIFEST_FILE_NAME,
    }),
  ],
  devtool: 'source-map',
};
