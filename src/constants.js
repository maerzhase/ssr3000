import path from 'path';
import { loadConfig } from './utils/configuration';

const constants = () => {
  const config = loadConfig();

  const clientConfigPath = path.join(
    process.cwd(),
    config.clientConfig,
  );

  const clientProdConfigPath = path.join(
    process.cwd(),
    config.clientProductionConfig,
  );

  const serverConfigPath = path.join(
    process.cwd(),
    config.serverConfig,
  );

  const serverProdConfigPath = path.join(
    process.cwd(),
    config.serverProductionConfig,
  );

  const host = config.host || '0.0.0.0';
  const port = config.port || 8000;

  return {
    config,
    clientConfigPath,
    clientProdConfigPath,
    serverConfigPath,
    serverProdConfigPath,
    host,
    port,
  };
};

export default constants();
