import ReactDom from 'react-dom';
import React from 'react';
import { SSR3000Provider, SSR3000Context } from '../server/context'; 

const render = () => {
  // const App = window.__SSR3000[entry];
  ReactDom.hydrate(
    <SSR3000Provider value={window.___SRR3000InitialContext}>
      <div>
        <SSR3000Context.Consumer>
          {
            (SSR3000) =>
            {
              const App = window.__SSR3000[SSR3000.entry];
              console.log(SSR3000);
              return <App.default {...window.___SRR3000InitialProps} />
            }
          }
        </SSR3000Context.Consumer>
      </div>
    </SSR3000Provider>,
    document.getElementById('root'),
    () => {
    // We don't need the static css any more once
    // we have launched our application.
    },
  );
};

export default render;
