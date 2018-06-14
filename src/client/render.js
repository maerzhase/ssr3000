import ReactDom from 'react-dom';
import React from 'react';

const render = (App) => {
  ReactDom.hydrate(
    <App.default {...window.___SRR3000InitialProps} />,
    document.getElementById('root'),
    () => {
    // We don't need the static css any more once
    // we have launched our application.
    },
  );
};

export default render;
