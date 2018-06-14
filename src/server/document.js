import React, { Component } from 'react';
import { SSR3000Context } from './context';
import { sortExternalsToTop } from '../webpack/utils';

export default class Document extends Component {
  render() {
    return (
      <html>
        <head>
          <SSR3000Head />
        </head>
        <body>
          <SSR3000Main />
          <SSR3000Script />
        </body>
      </html>
    );
  }
}

export const SSR3000Head = () => (
  <SSR3000Context.Consumer>
    {
      SSR3000 => SSR3000.chunks.js
        .sort(sortExternalsToTop)
        .map(s => (
          <script key={s} src={s}/>
        )
      )
    }
  </SSR3000Context.Consumer>
);

export const SSR3000Main = () => (
  <SSR3000Context.Consumer>
    {
      SSR3000 => (
        <div id="root">
          <SSR3000.App {...SSR3000.initialProps}/>
        </div>
      )
    }
  </SSR3000Context.Consumer>
);

export const SSR3000Script = () => (
  <SSR3000Context.Consumer>
    {
      SSR3000 => (
        <React.Fragment>
          <script dangerouslySetInnerHTML={{
            __html: `window.___SRR3000InitialProps = ${JSON.stringify(SSR3000.initialProps)};`
          }}/>
          <script dangerouslySetInnerHTML={{
            __html: `window.__SSR3000.render.default(window.__SSR3000.${SSR3000.entry});`
          }}/>
        </React.Fragment>
      )
    }
  </SSR3000Context.Consumer>
);
