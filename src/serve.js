import path from 'path';
import express from 'express';
import chalk from 'chalk';
import compressionMiddleware from 'compression';
import { log } from './utils/logging';
import constants from './constants';
import { getChunksFromManifest, loadCustomizations } from './utils/webpack';
import defaultClientConfig from './webpack/client.prod.config';
import defaultServerConfig from './webpack/server.prod.config';

const serve = (host, port) => {
  const customConfig = loadCustomizations(constants.configPath);

  const customClientConfig = customConfig && customConfig(
    defaultClientConfig,
    {
      isServer: false,
    },
  );

  const customServerConfig = customConfig && customConfig(
    defaultServerConfig,
    {
      isServer: true,
    },
  );

  const clientConfig = customClientConfig || defaultClientConfig;
  const serverConfig = customServerConfig || defaultServerConfig;

  if (!clientConfig || !serverConfig) {
    console.error('error loading config files');
    process.exit(1);
  }
  const {
    path: SERVER_BUILD_PATH,
    filename: SERVER_BUILD_FILE,
    publicPath: SERVER_PUBLIC_PATH, // eslint-disable-line
  } = serverConfig.output;

  const SERVER_BUILD_FILE_PATH = path.join(
    SERVER_BUILD_PATH,
    SERVER_BUILD_FILE,
  );

  const {
    path: CLIENT_BUILD_PATH,
    filename: CLIENT_BUILD_FILE, // eslint-disable-line
    publicPath: CLIENT_PUBLIC_PATH,
  } = clientConfig.output;

  const CLIENT_MANIFEST_PATH = path.join(CLIENT_BUILD_PATH, 'manifest.json');

  const HOST = host || constants.host;
  const PORT = port || constants.port;
  const manifest = require(CLIENT_MANIFEST_PATH); // eslint-disable-line 
  const { default: SSRMiddleware } = require(SERVER_BUILD_FILE_PATH); // eslint-disable-line 
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
  app.use(SSRMiddleware(chunks));
  app.listen(PORT, HOST, (err) => {
    if (err) console.error(err);
    log(chalk.yellow('serving production build'), chalk.bgYellow.black(`${HOST}:${PORT}`));
  });
};

export default serve;
