import ReactDom from 'react-dom';
import React from 'react';

const render = (entry) => {
  const App = window.__SSR3000[entry];
  const initialProps = window.___SRR3000InitialProps;
  ReactDom.render(<App.default {...initialProps}/>,
    document.getElementById('root'),
    () => {
    // We don't need the static css any more once
    // we have launched our application.
    },
  );
};

export default render;
