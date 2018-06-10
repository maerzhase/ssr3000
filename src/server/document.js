import React, { Component } from 'react';
import SSR3000Script from './SSR3000Script';

const doc = (chunks, App) => {
  const scripts = chunks.map(script => <script key={script} src={script}/>);
  class Document extends Component {
    render() {
      return (
        <html>
          <head>
            {
              scripts
            }
          </head>
          <body>
            <div id="root">
              <App />
            </div>
            <SSR3000Script />
          </body>
        </html>
      );
    }
  }
  return Document;
}

export default doc;

