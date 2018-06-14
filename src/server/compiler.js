import webpack from 'webpack';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { SSR3000Context } from './context';
import Document from './document';
import { webpackReporter } from '../utils/logging';
import {
  getChunkFiles,
  getBuildFiles,
} from '../webpack/utils';
import {
  APP_NAME,
} from '../webpack/constants';

export default function serverCompiler(webpackConfig) {
  const {
    path: BUILD_PATH,
    publicPath: PUBLIC_PATH,
  } = webpackConfig.output;

  const BUILD_FILES = getBuildFiles(
    webpackConfig.entry,
    BUILD_PATH
  );

  const compiler = webpack(webpackConfig);

  const invalidate = () => {
    Object.keys(BUILD_FILES).forEach((key) => {
      delete require.cache[BUILD_FILES[key]];
    });
  };

  compiler.watch({}, (error) => {
    if (error) {
      console.error(error);
    }
    invalidate();
  });

  return {
    isValid: (cb) => {
      compiler.hooks.done.tap('ssr3000-server-done', (stats) => {
        const hasErrors = webpackReporter(stats, 'server');
        if (hasErrors) return;
        cb(stats);
      });
    },
    middleware: async (req, res) => {
      const { webpackStats: stats } = res.locals;
      let { chunks } = stats.toJson();
      chunks = getChunkFiles(PUBLIC_PATH, chunks);
      const { default: App } = require(BUILD_FILES[APP_NAME]); // eslint-disable-line
      let initialProps = {};
      if (App.getInitialProps) {
        initialProps = await App.getInitialProps();
      }
      res.status(200)
        .send(renderToString(
          <SSR3000Context.Provider
            value={{
              entry: 'index',
              chunks,
              initialProps,
              App,
            }}
          >
            <Document />
          </SSR3000Context.Provider>
        )
      );
    },
  };
}
