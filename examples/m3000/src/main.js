import React from 'react';
import { hydrate } from 'react-dom';
import App from './components/App';

hydrate(
  <App />,
  document.getElementById('root'),
  () => {
    // We don't need the static css any more once
    // we have launched our application.
    const ssStyles = document.getElementById('server-side-styles');
    if (ssStyles) ssStyles.parentNode.removeChild(ssStyles);
  },
);
