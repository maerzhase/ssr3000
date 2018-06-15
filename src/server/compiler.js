import webpack from 'webpack';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { SSR3000Provider } from './context';
import Document from './document';
import { webpackReporter } from '../utils/logging';
import {
  getChunkFiles,
  getBuildFiles,
} from '../webpack/utils';

const getEntry = (path) => {
  if (path === '') return 'index';
  return path;
}

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
      const entry = getEntry(req.path.substr(1));
      const { default: App } = require(BUILD_FILES[entry]); // eslint-disable-line
      let initialProps = {};
      if (App.getInitialProps) {
        initialProps = await App.getInitialProps();
      }
      res.status(200)
        .send(renderToString(
          <SSR3000Provider
            value={{
              entry,
              chunks,
              initialProps,
              App,
              setEntry: () => {},
            }}
          >
            <Document />
          </SSR3000Provider>
        )
      );
    },
  };
}
