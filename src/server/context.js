import React from 'react';

const defaultContext = {
  entry: 'index',
  chunks: {},
};

export const SSR3000Context = React.createContext(
  defaultContext
);
