import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { webpackReporter } from '../utils/logging';
import constants from '../constants';

export default function clientCompiler(webpackConfig) {
  const addHotFeatures = constants.config.hot;

  let hotEntry = [];
  let hotPlugins = [];

  if (addHotFeatures) {
    hotEntry = [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    ];
    hotPlugins = [
      new webpack.HotModuleReplacementPlugin(),
    ];
  }

  const clientConfig = {
    ...webpackConfig,
    entry: [
      ...hotEntry,
      ...webpackConfig.entry,
    ],
    plugins: [
      ...hotPlugins,
      ...webpackConfig.plugins,
    ],
  };

  const compiler = webpack(clientConfig);

  const devMiddleware = webpackDevMiddleware(
    compiler,
    {
      publicPath: clientConfig.output.publicPath,
      quiet: true,
      serverSideRender: true,
    },
  );
  const hotMiddleware = webpackHotMiddleware(
    compiler,
    {
      log: false,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
    },
  );

  return {
    devMiddleware,
    hotMiddleware,
    isValid: (cb) => {
      compiler.plugin('done', (stats) => {
        const hasErrors = webpackReporter(stats, 'client');
        if (hasErrors) return;
        cb(stats);
      });
    },
  };
}
