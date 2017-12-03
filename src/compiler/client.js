import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { webpackReporter } from '../utils/logging';

export default function clientCompiler(webpackConfig) {
  const clientConfig = {
    ...webpackConfig,
    entry: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      ...webpackConfig.entry,
    ],
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
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
      reporter: (webpackStats) => {
        const stats = webpackStats.stats;
        webpackReporter(stats, 'client');
      },
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
  };
}
