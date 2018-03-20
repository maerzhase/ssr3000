const fs = require('fs');
const path = require('path');

const APP_PATH = fs.realpathSync(process.cwd());
const SRC_PATH = path.join(APP_PATH, 'src');

const JS_INCLUDES = [
  SRC_PATH,
];

const customConfig = (config) => { // eslint-disable-line
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          include: JS_INCLUDES,
          loader: 'eslint-loader',
          options: {
            cacheDirectory: true,
          },
        },
        ...config.module.rules,
      ],
    },
  };
};

module.exports = customConfig;
