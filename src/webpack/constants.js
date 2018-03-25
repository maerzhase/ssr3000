import fs from 'fs';
import path from 'path';

export const APP_PATH = fs.realpathSync(process.cwd());
export const SRC_PATH = path.join(APP_PATH, 'src');
export const CLIENT_ENTRY = path.join(SRC_PATH, 'main.js');
export const SERVER_ENTRY = path.join(SRC_PATH, 'serverMiddleware', 'index.js');
export const NODE_MODULES_PATH = path.join(APP_PATH, 'node_modules');
export const CLIENT_BUILD_PATH = path.join(APP_PATH, 'build', 'client');
export const SERVER_BUILD_PATH = path.join(APP_PATH, 'build', 'server');
export const PUBLIC_PATH = '/static/';
export const STATIC_ASSETS_DIR_IN = path.join(APP_PATH, 'static');
export const STATIC_ASSETS_DIR_OUT = path.join(SERVER_BUILD_PATH, 'static');

export const JS_INCLUDES = [
  SRC_PATH,
];
