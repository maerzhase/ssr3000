import path from 'path';
import express from 'express';
import chalk from 'chalk';
import compressionMiddleware from 'compression';
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
  SERVER_MIDDLEWARE,
  APP_NAME,
} from './webpack/constants';

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
  const { default: SSRMiddleware } = require(BUILD_FILES[SERVER_MIDDLEWARE]); // eslint-disable-line 
  const { default: App } = require(BUILD_FILES[APP_NAME]); // eslint-disable-line
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
  app.use(SSRMiddleware(chunks, App));
  app.listen(PORT, HOST, (err) => {
    if (err) console.error(err);
    log(chalk.yellow('serving production build'), chalk.bgYellow.black(`${HOST}:${PORT}`));
  });
};

export default serve;
