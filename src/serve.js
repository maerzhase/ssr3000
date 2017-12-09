import path from 'path';
import express from 'express';
import chalk from 'chalk';
import compressionMiddleware from 'compression';
import { log } from './utils/logging';
import {
  clientProdConfigPath,
  serverProdConfigPath,
  HOST as DEFAULT_HOST,
  PORT as DEFAULT_PORT,
} from './constants';
import { getChunksFromManifest, resolveConfig } from './utils/webpack';

const serve = (host, port, cConfig, sConfig) => {
  const clientConfig = resolveConfig(cConfig, clientProdConfigPath);
  const serverConfig = resolveConfig(sConfig, serverProdConfigPath);
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

  const HOST = host || DEFAULT_HOST;
  const PORT = port || DEFAULT_PORT;
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
