import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { webpackReporter } from '../utils/logging';
import { AVAILABLE_PATHS } from '../webpack/constants';

const HOT_PATH = '__ssr3000_hot';
const HOT_TIMEOUT = 20000;
const HOT_HEARTBEAT = 2500;

export default function clientCompiler(webpackConfig) {
  const hotEntry = name => `webpack-hot-middleware/client?path=/${HOT_PATH}&timeout=${HOT_TIMEOUT}&name=${name}&noInfo=true&reload=true`;
  const hotPlugins = [
    new webpack.HotModuleReplacementPlugin(),
  ];

  const entries = Object.keys(webpackConfig.entry).reduce((acc, key) => {
    if (AVAILABLE_PATHS.indexOf(key) > -1) {
      acc[key] = [
        hotEntry(key),
        webpackConfig.entry[key],
      ];
    } else {
      acc[key] = [
        webpackConfig.entry[key],
      ];
    }

    return acc;
  }, {});

  const clientConfig = {
    ...webpackConfig,
    entry: entries,
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
      noInfo: true,
      logLevel: 'silent',
      serverSideRender: true,
      writeToDisk: true,
    },
  );
  const hotMiddleware = webpackHotMiddleware(
    compiler,
    {
      log: false,
      path: `/${HOT_PATH}`,
      heartbeat: HOT_HEARTBEAT,
    },
  );

  return {
    devMiddleware,
    hotMiddleware,
    isValid: (cb) => {
      compiler.hooks.done.tap('ssr3000-client-done', (stats) => {
        const hasErrors = webpackReporter(stats, 'client');
        if (hasErrors) return;
        cb(stats);
      });
    },
  };
}
