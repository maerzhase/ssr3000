import path from 'path';

export const clientConfigPath = path.join(
  process.cwd(),
  'webpack.client.config.js',
);

export const clientProdConfigPath = path.join(
  process.cwd(),
  'webpack.client.prod.config.js',
);

export const serverConfigPath = path.join(
  process.cwd(),
  'webpack.server.config.js',
);

export const serverProdConfigPath = path.join(
  process.cwd(),
  'webpack.server.prod.config.js',
);

export const HOST = process.env.HOST || '0.0.0.0';
export const PORT = process.env.PORT || 8000;
