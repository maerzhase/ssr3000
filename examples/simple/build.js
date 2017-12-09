import ssr3000 from '../../src/index';
import clientConfig from './webpack.client.prod.config';
import serverConfig from './webpack.server.prod.config';

const SSR3000 = ssr3000();

SSR3000.build(clientConfig, serverConfig);
