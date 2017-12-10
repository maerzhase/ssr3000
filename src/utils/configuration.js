import path from 'path';
import fs from 'fs';

const RCFile = '.ssr3000rc';

const defaultConfig = {
  host: '0.0.0.0',
  port: '9999',
  clientConfig: 'webpack.client.config.js',
  clientProductionConfig: 'webpack.client.prod.config.js',
  serverConfig: 'webpack.server.config.js',
  serverProductionConfig: 'webpack.server.prod.config.js',
  hot: true,
};

export const loadConfig = () => { // eslint-disable-line
  const rcPath = path.join(process.cwd(), RCFile);
  let config = {};
  if (fs.existsSync(rcPath)) {
    const rcContent = fs.readFileSync(path.join(process.cwd(), RCFile), 'utf-8');
    config = JSON.parse(rcContent.toString());
  }
  return {
    ...defaultConfig,
    ...config,
  };
};
