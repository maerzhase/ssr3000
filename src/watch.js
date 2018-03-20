import express from 'express';
import moment from 'moment';
import chalk from 'chalk';
import clientCompiler from './compiler/client';
import serverCompiler from './compiler/server';
import { errorBanner, log } from './utils/logging';
import constants from './constants';
import { loadCustomizations } from './utils/webpack';
import defaultClientConfig from './webpack/client.config';
import defaultServerConfig from './webpack/server.config';

const watch = (host, port) => {
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
    errorBanner('error loading config files');
    process.exit(1);
  }
  const HOST = host || constants.host;
  const PORT = port || constants.port;
  const ClientCompiler = clientCompiler(clientConfig);
  const ServerCompiler = serverCompiler(serverConfig);
  const app = express();

  let firstCompile = true;
  let clientReady = false;
  let serverReady = false;

  app.use(ClientCompiler.devMiddleware);
  app.use(ClientCompiler.hotMiddleware);
  app.use(ServerCompiler.middleware);

  const reportValidity = () => {
    if (clientReady && serverReady) {
      log(`${chalk.black.bgWhite(moment().format('dddd, DD MMMM — hh:mm:ss'))}`);
      if (firstCompile) {
        app.listen(PORT, HOST, () => {
          log(chalk.gray('first build successfull, watching for changes'));
          log(chalk.yellow('app is running on'), chalk.bgYellow.black(`${HOST}:${PORT}`));
          console.log();
        });
        firstCompile = false;
      }
      clientReady = false;
      serverReady = false;
      console.log();
    }
  };

  ServerCompiler.isValid(() => {
    serverReady = true;
    reportValidity();
  });
  ClientCompiler.isValid(() => {
    clientReady = true;
    reportValidity();
  });

  console.log();
  log(chalk.gray('waiting for server and client bundle'));
};

export default watch;
