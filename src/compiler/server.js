import webpack from 'webpack';
import path from 'path';
import log, { webpackReporter } from '../utils/logging';
import { getChunkFiles } from '../utils/webpack';

export default function serverCompiler(webpackConfig) {
  const {
    path: BUILD_PATH,
    filename: BUILD_FILE,
    publicPath: PUBLIC_PATH,
  } = webpackConfig.output;

  const BUILD_FILE_PATH = path.join(
    BUILD_PATH,
    BUILD_FILE,
  );

  const compiler = webpack(webpackConfig);

  const invalidate = () => {
    delete require.cache[BUILD_FILE_PATH];
  };

  const watch = (callback) => {
    log('start watching server');
    compiler.watch({}, (error, stats) => {
      if (error) {
        console.error(error);
      }
      webpackReporter(stats, 'server');
      invalidate();
      callback(stats);
    });
  };

  return {
    watch,
    middleware: (req, res, next) => {
      const { default: SSRMiddleware } = require(BUILD_FILE_PATH); // eslint-disable-line
      const { webpackStats: stats } = res.locals;
      let { chunks } = stats.toJson();
      chunks = getChunkFiles(PUBLIC_PATH, chunks);
      const middleware = SSRMiddleware(chunks);
      middleware(req, res, next);
    },
  };
}
