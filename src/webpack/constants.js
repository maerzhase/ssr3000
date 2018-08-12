import fs from 'fs';
import path from 'path';

export const SSR3000_LIB = '__SSR3000';
export const MAKE_SSR3000_LIB_NAME = name => `${SSR3000_LIB}.${name}.js`
export const EXTERNAL_LIBS = 'vendors';
export const CLIENT_RENDER = 'render';

export const SERVER_STYLES_CONTAINER_ID = 'SSR3000_JSSTYLES_CONTAINER';

export const APP_PATH = fs.realpathSync(process.cwd());
export const SRC_PATH = path.join(APP_PATH, 'src');
export const PAGES_PATH = path.join(SRC_PATH, 'pages');
export const ALL_PAGES = fs.readdirSync(PAGES_PATH);
export const ALL_ENTRIES = ALL_PAGES.reduce((entries, p) => {
  entries[p.replace('.js', '')] = path.join(PAGES_PATH, p);
  return entries;
}, {});
export const AVAILABLE_PATHS = Object.keys(ALL_ENTRIES);
export const NODE_MODULES_PATH = path.join(APP_PATH, 'node_modules');

export const SSR3000_PATH = path.join(NODE_MODULES_PATH, 'SSR3000');
export const SSR3000_CLIENT_PATH = path.join(SSR3000_PATH, 'lib', 'client');
export const SSR3000_SERVER_PATH = path.join(SSR3000_PATH, 'lib', 'server');
export const SRR3000_DEFAULT_RENDER = path.join(SSR3000_CLIENT_PATH, `${CLIENT_RENDER}.js`);

export const CLIENT_BUILD_PATH = path.join(APP_PATH, 'build', 'client');
export const SERVER_BUILD_PATH = path.join(APP_PATH, 'build', 'server');
export const PUBLIC_PATH = '/static/';
export const STATIC_ASSETS_DIR_IN = path.join(APP_PATH, 'static');
export const STATIC_ASSETS_DIR_OUT = path.join(SERVER_BUILD_PATH, 'static');

export const JS_INCLUDES = [
  SRC_PATH,
];
