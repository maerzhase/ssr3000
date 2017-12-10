# `SRR3000`

A simple serverside rendering framework for react applications. build with [express](https://github.com/expressjs/express) and [webpack](https://github.com/webpack/webpack).

## The idea

`SSR3000` i build around the principle of having two different entry files for your application:
- The __client entry__, which usually calls React.render
- The __server entry__, that handles requests and decides how content get's rendered to the client

### client entry file
A typical __client entry__ file will look similar to this:
```
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { hydrate } from 'react-dom';
import App from './components/App';

hydrate(
  <AppContainer>
      <App />
  </AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./components/App.js', () => {
    const NextApp = require('./components/App.js').default; // eslint-disable-line
    hydrate(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      document.getElementById('root'),
    );
  });
}

```

SSR3000 uses hot realoading by default. In order to make the hot reloading work we need the snippet with the if-clause. [see react-hot-loader](https://github.com/gaearon/react-hot-loader). You can switch off hot loading in the [`.ssr3000rc`](#ssr3000rc)

### server entry file

The __server entry__  is an middleware that will be added to the `express` server. `SSR3000` takes care of the webpack bundling in the background and serves the chunk files to your middleware. 

```
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Router } from 'express';
import App from '../components/App';

export default (chunks) => {
  const router = new Router();
  router.use((req, res, next) => {
    res.status(200);
    res.send(`
      <html>
        <head>
          <title>SSR3000 Application</title>
        </head>
        <body>
          <div id="root">
            ${renderToString(<App/>)}
          </div>
          <script src="${chunks.js[0]}"" />
        </body>
      </html>
    `);
  });
  return router;
}
```

It's important to realize that you are responsible for what get's rendered to your client. Without your middleware the server is running but there is no default way of handling responses — therefore without your middleware you will see no output in the browser. It also gives you the greatest flexibilty, because you can provide additional logic e.g. handle routing, serialize inital data to the browser, etc.


## Getting started

  1. `npm install --save ssr3000`

  2. Create a [`.ssr3000rc`](#ssr3000rc) file
  
  3. Create the [webpack configuration](#a-brief-digression-into-webpack).


## Node.js API

### ssr3000

`ssr3000()`

the default export of the SSR3000 module is an ssr3000 instance read to be initialized. 

```
import ssr3000 from 'ssr3000';

const SSR3000 = ssr3000();
```

### watch

`ssr3000.watch(host, port, clientConfig, serverConfig)`

The watch function starts the SSR3000 server for development. You can provide When the first bundle is ready it will notify that a server has been started. If no `clientConfig` and/or `serverConfig` parameters are provided the renderer will look for a `webpack.client.config.js` and `webpack.server.config.js` in the folder from where the application is running.

```
import ssr3000 from 'ssr3000';
import clientConfig from './webpack.client.config'; // this is also the default fallback path
import serverConfig from './webpack.server.config'; // this is also the default fallback path

const SSR3000 = ssr3000();

SSR3000.watch('0.0.0.0', 9999, clientConfig, serverConfig); 
```

### build

`ssr3000.build(clientProductionConfig, serverProductionConfig)`

The build function will build your application for production. If no `clientProductionConfig` and/or `serverProductionConfig` parameters are provided the renderer will look for a `webpack.client.prod.config.js` and `webpack.server.prod.config.js` in the folder from where the application is running. The process will terminate after the build was successfull. 

```
import ssr3000 from '../../src/index';
import clientProductionConfig from './webpack.client.prod.config';
import serverProductionConfig from './webpack.server.prod.config';

const SSR3000 = ssr3000();

SSR3000.build(clientProductionConfig, serverProductionConfig);
```

### serve

`ssr3000.serve(host, port, clientProductionConfig, serverProductionConfig)`

The serve function will serve the production build of your application – make sure u have used [ssr3000.build()](#build) before. If no `clientProductionConfig` and/or `serverProductionConfig` parameters are provided the server will look for a `webpack.client.prod.config.js` and `webpack.server.prod.config.js` in the folder from where the application is running.

```
import ssr3000 from '../../src/index';
import clientProductionConfig from './webpack.client.prod.config';
import serverProductionConfig from './webpack.server.prod.config';

const SSR3000 = ssr3000();

SSR3000.serve('0.0.0.0', 9999, clientProductionConfig, serverProductionConfig);

```

## .ssr3000rc

Use the `.ssr3000rc` to configure SSR3000 to serve your project structure. The `.ssr3000rc` files must be a valid JSON file, since it will be serialized to JSON.

```
{
  "host": "localhost",
  "port": 8000,
}
```

### Options

| Option                   | Default                              | Description                                               |
| ------------------------ | ------------------------------------ | --------------------------------------------------------- |
| `host`                   | `"0.0.0.0"`                          | set the hostname for the server                           |
| `port`                   | `9999`                               | set the port for the server                               |
| `configPath`             | `process.cwd()`                      | set the path from where the webpack configs are loaded    |
| `clientConfig`           | `"webpack.client.config"`            | set the filename for webpack client config in development |
| `clientProductionConfig` | `"webpack.client.production.config"` | set the filename for webpack client config in production  |
| `serverConfig`           | `"webpack.server.config"`            | set the filename for webpack server config in development |
| `serverProductionConfig` | `"webpack.server.production.config"` | set the filename for webpack server config in production  |
| `hot`                    | `true`                               | specify if hot loading should be enabled                  |


## Examples

see `examples/simple/` for a simple react application setup.

## A brief digression into webpack
SSR3000 uses weback in the background to bundle your application. You have to provide a webpack configuration that serves the needs of your application. Since we are running a serverside application we need a config for the __client__ and for the __server__.


#### Entry
Set the entry points of your application
###### For full documentation see [Webpack Concepts: Entry](https://webpack.js.org/concepts/#entry)
```
{
  target: 'web',
  entry: [
    './src/clientEntry.js',
  ],
  ...
}
```

```
{
  target: 'node',
  entry: [
    './src/serverEntry.js',
  ],
  ...
}
```



#### Output
Set the output settings for your appliation.
###### For full documentation see [Webpack Concepts: Output](https://webpack.js.org/concepts/#output)
```
{
  target: 'web',
  output: {
    path: './build/client',
    filename: '[name].[hash:8].js',
    publicPath: '/assets/',
  },
  ...
}
```


```
{
  target: 'node',
  output: {
    path: './build/server',
    filename: 'bundle.js',
    publicPath: '/assets/',
    libraryTarget: 'commonjs2',
  },
  ...
}
```

#### Loaders
Decide how different file types should be loaded. This is done so u can require any file type in your code.
###### For full documentation see [Webpack Concepts: Loaders](https://webpack.js.org/concepts/#loaders)
```
{
  ...
  module: {
    rules: [
      {
        test: /\.js$/,
        include: JS_INCLUDES,
        loader: 'babel-loader',
      },
    ],
  },
  ...
}
```

#### Plugins (optional)
While loaders are mandatory for all the file types that you use within your application, plugins are totally optional. 
"Plugins range from bundle optimization and minification all the way to defining environment-like variables", the webpack docs.
###### For full documentation see [Webpack Concepts: Plugins](https://webpack.js.org/concepts/#plugins)
```
{
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
  ],
}
```

##### Target
Because our application is getting bundled for the client and for the server the webpack configs need to set the target option accordingly. 
`target: 'node'` or `target: 'web'`
###### For full documentation see [Webpack Concepts: Target](https://webpack.js.org/concepts/targets/)

