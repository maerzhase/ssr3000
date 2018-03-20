import serverConfig from './server.config';

export default {
  ...serverConfig,
  mode: 'production',
  devtool: 'source-map',
};
