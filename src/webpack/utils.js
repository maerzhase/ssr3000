import fs from 'fs';
import path from 'path';
import { log } from '../utils/logging';
import { EXTERNAL_LIBS, SSR3000_LIB } from './constants';

export const CSS = /.css$/;
export const JS = /.js$/;

export const getChunkFiles = (publicPath, chunks) => { // eslint-disable-line
  return chunks.reduce((files, chunk) => {
    const chunkFiles = chunk.files.map(chunkFile => publicPath + chunkFile);

    const cssFiles = chunkFiles.filter(chunkFile => CSS.test(chunkFile));
    const jsFiles = chunkFiles.filter(chunkFile => JS.test(chunkFile));

    files.css = files.css.concat(cssFiles);
    files.js = files.js.concat(jsFiles);

    return files;
  }, { js: [], css: [] });
};

export function getChunksFromManifest(clientPublicPath, manifest) {
  return Object.values(manifest).reduce((files, chunk) => {
    const filePath = chunk;

    if (CSS.test(filePath)) {
      files.css.push(filePath);
    } else if (JS.test(filePath)) {
      files.js.push(filePath);
    }

    return files;
  }, { js: [], css: [] });
}

export const resolveConfig = file => (
  require(file).default || // eslint-disable-line
  require(file) //eslint-disable-line
);

export const loadCustomizations = (path, defaultClientConfig, defaultServerConfig) => { // eslint-disable-line
  const configs = {
    clientConfig: defaultClientConfig,
    serverConfig: defaultServerConfig,
  };
  if (!fs.existsSync(path)) return configs;
  let customConfig;
  try {
    log('trying to load ssr3000.config.js');
    customConfig = resolveConfig(path);
    configs.clientConfig = customConfig(
      defaultClientConfig,
      {
        isServer: false,
      },
    );
    configs.clientConfig = customConfig(
      defaultServerConfig,
      {
        isServer: true,
      },
    );
    log('config loaded.');
  } catch (e) {
    log('error loading ssr3000.config.js', e);
  }
  return configs;
};

export const conditionalPlugin = (condition, plugin) => {
  if (condition) {
    return [plugin];
  }
  return [];
};

export const sortExternalsToTop = (a, b) => {
  if (a.indexOf(EXTERNAL_LIBS) > -1) return -1;
  if (b.indexOf(EXTERNAL_LIBS) > -1) return 1;
  return 0;
};

export const getBuildFiles = (entries, BUILD_PATH) => (
  Object.keys(entries).reduce((acc, key) => {
    acc[key] = path.join(
      BUILD_PATH,
      `${SSR3000_LIB}.${key}.js`,
    );
    return acc;
  }, {})
);

