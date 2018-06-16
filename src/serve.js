import path from 'path';
import express from 'express';
import chalk from 'chalk';
import React from 'react';
import { renderToString } from 'react-dom/server';
import compressionMiddleware from 'compression';
import { SSR3000Context } from './server/context';
import Document from './server/document';
import { log } from './utils/logging';
import constants from './constants';
import {
  getChunksFromManifest,
  loadCustomizations,
  getBuildFiles,
} from './webpack/utils';
import defaultClientConfig from './webpack/client.prod.config';
import defaultServerConfig from './webpack/server.prod.config';
import {
  STATIC_ASSETS_DIR_OUT,
} from './webpack/constants';

const getEntry = (path) => {
  if (path === '') return 'index';
  return path;
}

const serve = (host, port) => {
  const {
    clientConfig,
    serverConfig,
  } = loadCustomizations(
    constants.configPath,
    defaultClientConfig,
    defaultServerConfig,
  );

  if (!clientConfig || !serverConfig) {
    console.error('error loading config files');
    process.exit(1);
  }
  const {
    path: SERVER_BUILD_PATH,
    filename: SERVER_BUILD_FILE,
    publicPath: SERVER_PUBLIC_PATH, // eslint-disable-line
  } = serverConfig.output;

  const BUILD_FILES = getBuildFiles(serverConfig.entry, SERVER_BUILD_PATH);

  const {
    path: CLIENT_BUILD_PATH,
    filename: CLIENT_BUILD_FILE, // eslint-disable-line
    publicPath: CLIENT_PUBLIC_PATH,
  } = clientConfig.output;

  const CLIENT_MANIFEST_PATH = path.join(CLIENT_BUILD_PATH, 'manifest.json');

  const HOST = host || constants.host;
  const PORT = port || constants.port;
  const manifest = require(CLIENT_MANIFEST_PATH); // eslint-disable-line 
  /*
   * Retrieve all relevant JS + CSS Files
   * from Mainfest with public path appended
   */
  const chunks = getChunksFromManifest(
    CLIENT_PUBLIC_PATH,
    manifest,
  );
  const app = express();
  app.use(compressionMiddleware());
  app.use(CLIENT_PUBLIC_PATH, express.static(CLIENT_BUILD_PATH));
  app.use('/static', express.static(STATIC_ASSETS_DIR_OUT));
  app.use( async (req, res, next) => {
    const entry = getEntry(req.path.substr(1));
    const BUILD_FILE = BUILD_FILES[entry];
    if (!BUILD_FILE) {
      return next();
    }
    const { default: App } = require(BUILD_FILES[entry]); // eslint-disable-line
    let initialProps = {};
    if (App.getInitialProps) {
      initialProps = await App.getInitialProps();
    }
    res.status(200)
      .send(renderToString(
        <SSR3000Context.Provider
          value={{
            entry,
            chunks,
            initialProps,
            App,
          }}
        >
          <Document />
        </SSR3000Context.Provider>
      )
    );
  });
  app.listen(PORT, HOST, (err) => {
    if (err) console.error(err);
    log(chalk.yellow('serving production build'), chalk.bgYellow.black(`${HOST}:${PORT}`));
  });
};

export default serve;
