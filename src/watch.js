import express from 'express';
import moment from 'moment';
import chalk from 'chalk';
import clientCompiler from './compiler/client';
import serverCompiler from './compiler/server';
import { info, errorBanner, log } from './utils/logging';
import {
  clientConfigPath,
  serverConfigPath,
  HOST as DEFAULT_HOST,
  PORT as DEFAULT_PORT,
} from './constants';
import { resolveConfig } from './utils/webpack';

const watch = (host, port, cConfig, sConfig) => {
  const clientConfig = resolveConfig(cConfig, clientConfigPath);
  const serverConfig = resolveConfig(sConfig, serverConfigPath);
  if (!clientConfig || !serverConfig) {
    errorBanner('error loading config files');
    process.exit(1);
  }
  const HOST = host || DEFAULT_HOST;
  const PORT = port || DEFAULT_PORT;
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
