import ssr3000 from '../../src/index';
import clientConfig from './webpack.client.config';
import serverConfig from './webpack.server.config';

const SSR3000 = ssr3000();

SSR3000.watch('0.0.0.0', 9999, clientConfig, serverConfig);
