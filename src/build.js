import webpack from 'webpack';
import { buildTime, info, success } from './utils/logging';
import constants from './constants';
import { loadCustomizations } from './utils/webpack';
import defaultClientConfig from './webpack/client.prod.config';
import defaultServerConfig from './webpack/server.prod.config';

function compile(config) {
  return new Promise((resolve, reject) => {
    webpack(config).run((error, stats) => {
      if (error != null) {
        reject(error);
      } else {
        resolve(stats);
      }
    });
  });
}

const build = () => {
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

  info('start client build');
  compile(clientConfig).then((stats) => {
    success(`client webpack build time ${buildTime(stats)}ms`);
  });
  info('start server build');
  compile(serverConfig).then((stats) => {
    success(`server webpack build time ${buildTime(stats)}ms`);
  });
};

export default build;
