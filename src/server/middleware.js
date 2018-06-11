import React from 'react';
import { renderToString } from 'react-dom/server';
import { Router } from 'express';
import { SSR3000Context } from './context';
import Document from './document';

export default (chunks, App) => {
  const router = new Router();
  router.use((req, res) => {
    res.status(200);
    res.send(renderToString(
      <SSR3000Context.Provider
        value={{
          entry: 'index',
          chunks,
          App,
        }}
      >
        <Document />
      </SSR3000Context.Provider>
    ));
  });
  return router;
};
