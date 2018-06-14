import React from 'react';

const defaultContext = {
  entry: 'index',
  chunks: {},
  initialProps: {},
};

export const SSR3000Context = React.createContext(
  defaultContext
);
