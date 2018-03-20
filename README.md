# SSR3000

A simple serverside rendering framework for react applications. build with [express](https://github.com/expressjs/express) and [webpack >= 4.0.0](https://github.com/webpack/webpack).


## The idea

SSR3000 is build around the principle of having two different entry files for your application:
- The __client entry__, which usually calls `React.render` or `React.hydrate`
- The __server entry__, that handles requests and serves a response to the client

SSR3000 comes with a default webpack configuration that takes away the pain of setting up `webpack`. 
If you need to customize the `webpack` configuration you can do that with the [`ssr3000.config.js`](#ssr3000configjs).


## Getting started

  1. `npm install --save ssr3000 react react-dom react-hot-loader express lodash.template `

  2. add scripts to your package.json

```
{
  ...
  scripts: {
    "watch": "./node_modules/.bin/ssr3000-watch",
    "build": "./node_modules/.bin/ssr3000-build",
    "serve": "./node_modules/.bin/ssr3000-serve"
  },
  ...
}
```
  3. create a `src` folder

  4. create client entry: `src/main.js`

```JavaScript
import React from 'react';
import { hydrate } from 'react-dom';
import App from './components/App';

hydrate(
  <App />,
  document.getElementById('root'),
);
```

  5. create `serverMiddleware` folder

  6. create html template to serve: `serverMiddleware/index.ejs`

```
<html>
  <head>
    <title>SSR3000 App</title>
  </head>
  <body>
    <div id="root"><%= app %></div>
    <% chunks.js.forEach((chunk) => { %><script src="<%= chunk %>"></script><% }); %>
  </body>
</html>
```

  7. create server entry: `serverMiddleware/index.js`

```JavaScript
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Router } from 'express';
import compile from 'lodash.template';
import templateContent from './index.ejs';
import App from '../components/App';

const template = compile(templateContent);

export default (chunks) => {
  const router = new Router();
  router.use((req, res) => {
    res.status(200);
    res.send(template({
      chunks,
      app: renderToString(<App />),
    }));
  });
  return router;
};
``` 

  8. create components folder with e.g. `App.js`

```JavaScript
import React from 'react';
import { hot } from 'react-hot-loader';

const App = () => (
  <div>
    Hello World
  </div>
);

export default hot(module)(App);
```
###### SSR3000 uses hot realoading by default when watching your application. See [react-hot-loader](https://github.com/gaearon/react-hot-loader) for more informations.

 9. `npm run watch`

## ssr3000.config.js

In order to extends the webpack configuration you can define a `ssr3000.config.js` file that exports a function, which returns the modified webpack configuration.
##### Warning: this file is not going to be transpiled with babel. So you need to write it in vanilla JS and/or features that are supported by your Node.js version


```JavaScript
const customConfig = (config, { isServer }) => {
  return {
    ...config,
  }
}

module.exports = customConfig;

```

Since we are always configuring webpack for the client and the server, this function will get called twice. Once for the server and once for the client. You can distinguish between them with the isServer parameter.


## .ssr3000rc

Use the `.ssr3000rc` to configure SSR3000 for your project. The `.ssr3000rc` files must be a valid JSON file.

```
{
  "host": "localhost",
  "port": 8000
}
```

### Options

| Option                   | Default                              | Description                                           |
| ------------------------ | ------------------------------------ | ----------------------------------------------------  |
| `host`                   | `"0.0.0.0"`                          | set the hostname for the server                       |
| `port`                   | `9999`                               | set the port for the server                           |


## ServerMiddleware

It's important to realize that you are responsible for what get's rendered to your client. Without your middleware the server is running but there is no default way of handling responses — therefore without your middleware you will see no output in the browser. It also gives you the greatest flexibilty, because you can provide additional logic e.g. handle routing, serialize inital data to the browser, etc.


## Node.js API

### ssr3000

```JavaScript
ssr3000()
```

the default export of the SSR3000 module is an ssr3000 instance ready to be initialized. 

```JavaScript
import ssr3000 from 'ssr3000';

const SSR3000 = ssr3000();
```

### watch

```JavaScript
ssr3000.watch(host, port)
```

The watch function starts the SSR3000 server for development. When the first bundle is ready it will notify that a server has been started. If no `host` and/or `port` parameters are provided it will use the default values (0.0.0.0:9999) or use the values from the [`.ssr3000rc`](#ssr3000rc).

```JavaScript
import ssr3000 from 'ssr3000';

const SSR3000 = ssr3000();

SSR3000.watch('0.0.0.0', 9999); 
```

### build

```JavaScript
ssr3000.build()
```

The build function will build your application for production.

```JavaScript
import ssr3000 from 'ssr3000';

const SSR3000 = ssr3000();

SSR3000.build();
```

### serve

```JavaScript
ssr3000.serve(host, port)
```

The serve function will serve the production build of your application – make sure u have used [ssr3000.build()](#build) before. If no `host` and/or `port` parameters are provided it will use the default values (0.0.0.0:9999) or use the values from the [`.ssr3000rc`](#ssr3000rc)..

```JavaScript
import ssr3000 from 'ssr3000';

const SSR3000 = ssr3000();

SSR3000.serve('0.0.0.0', 9999);

```

## CLI

SSR3000 comes with a built-in CLI which can be used to watch, build and serve your application from the command line.
There three are methods exported to the `node_modules/.bin` folder. You are free to add [npm run scripts](https://docs.npmjs.com/cli/run-script) to your `package.json` or execute the cli tools with the relative path instead. You can configure SSR3000 with the [`.ssr3000rc`](#ssr3000rc).


### watch

start development server

`./node_modules/.bin/ssr3000-watch`


### build

create a production build

`./node_modules/.bin/ssr3000-build`


### serve

run the production server

`./node_modules/.bin/ssr3000-serve`


## Examples

see `examples/simple/` for a simple react application setup.
see `examples/advanced/` for an example with modified webpack config and [`react-jss`](https://github.com/cssinjs/react-jss) for (server-side) styles


### Usage

run `npm install` from within the _examples/simple_ folder

To demonstrate the usage of the `.ssr3000rc` the example comes with commands to use the Node.js API and the CLI (npm commands have `cli:` prefix). You could run both at the same time because CLI and Node.js API start on different ports.

#### Start development server

To start the dev server, run `npm run watch` or `npm run cli:watch`


#### Build for production

To create a production build run `npm run build` or `npm run cli:build`


#### Serve production build

To start the production server, run `npm run serve` or `npm run cli:serve`


## A brief digression into webpack
SSR3000 uses weback in the background to bundle your application. You no longer need to provide your own webpack configuration. SSR3000 aims to have a fully functional configuration made for all purpose. If you want to customize the webpack configuration anyway you can do that with the [`ssr3000.config.js`](#ssr3000configjs). 
This section is meant to give you an overview of the most important parts of a webpack configuration. If u want to undestand how webpack works in detail please visit the [webpack-website](https://webpack.js.org).

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

