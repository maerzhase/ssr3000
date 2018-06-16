import React from 'react';

const defaultContext = {
  entry: 'index',
  chunks: {},
  initialProps: {},
  App: null,
  setEntry: null,
};

export const SSR3000Context = React.createContext(
  defaultContext
);
