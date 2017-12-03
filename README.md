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
import { hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';

hydrate(
  <AppContainer>
      <App />
  </AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./components/App.js', () => {
    const NextApp = require('./components/App.js').default;
    hydrate(
      <AppContainer>
          <NextApp />
      </AppContainer>,
      document.getElementById('root'),
    );
  });
}
```

### server entry file

The __server entry__  actually is an express middleware that is used by the `SSR3000` server directly. At the back of the stage `SSR3000` takes care of the webpack bundling and then serves the chunk files to your middleware. 

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

It's important to realize that you are responsible for what get's rendered to your client. Without your middleware the server is running but there is no default way of handling responses — therefore without your middleware you will see not output in the browser. But it also gives you the greatest flexibilty, because you can provide additional logic to handle routing or serialize inital stores to your client.


## Getting started

  1. `npm install --save ssr3000`
  
  2. Provide the webpack configuration. There are 3 main parts that are mandatory; the rest is taken care of. Since we are running a serverside application we need a config for the __client__ and for the __server__. [(see configuration section)](#configuration)


## Use nodejs API
See `examples/simple` for a basic react application setup with `SSR3000`

## Use CLI
example comming soon


## Configuration
Based on the SSR3000 principle let's take a look at the mandatory webpack configuration to run your project. 

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

