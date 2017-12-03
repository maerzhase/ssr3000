import express from 'express';
import clientCompiler from './compiler/client';
import serverCompiler from './compiler/server';
import { info } from './utils/logging';
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
  if (!clientConfig && !serverConfig) {
    console.error('error loading config files');
    process.exit(1);
  }
  const ClientCompiler = clientCompiler(clientConfig);
  const ServerCompiler = serverCompiler(serverConfig);
  const app = express();
  ServerCompiler.watch(() => {

  });

  app.use(ClientCompiler.devMiddleware);
  app.use(ClientCompiler.hotMiddleware);
  app.use(ServerCompiler.middleware);

  const HOST = host || DEFAULT_HOST;
  const PORT = port || DEFAULT_PORT;
  app.listen(PORT, HOST, () => {
    info(`app is running on ${HOST}:${PORT}`);
    console.log();
  });
};

export default watch;
