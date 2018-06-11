import React, { Component } from 'react';
import SSR3000Script, { SSR3000Head, SSR3000Main } from './SSR3000Script';

class Document extends Component {
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

export default Document;

