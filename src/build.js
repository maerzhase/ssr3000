import webpack from 'webpack';
import { buildTime, info, success } from './utils/logging';
import { clientProdConfigPath, serverProdConfigPath } from './constants';
import { resolveConfig } from './utils/webpack';


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

const build = (cConfig, sConfig) => {
  const clientConfig = resolveConfig(cConfig, clientProdConfigPath);
  const serverConfig = resolveConfig(sConfig, serverProdConfigPath);
  if (!clientConfig && !serverConfig) {
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