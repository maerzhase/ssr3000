import path from 'path';
import { loadConfig } from './utils/configuration';

const constants = () => {
  const config = loadConfig();

  const configPath = path.join(
    process.cwd(),
    'ssr3000.config.js',
  );

  const host = config.host || '0.0.0.0';
  const port = config.port || 8000;

  return {
    config,
    configPath,
    host,
    port,
  };
};

export default constants();
