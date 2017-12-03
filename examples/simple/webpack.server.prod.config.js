import webpackServerConifg from './webpack.server.config';

export default {
  ...webpackServerConifg,
  devtool: 'source-map',
}