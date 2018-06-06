import React from 'react';
import { renderToString } from 'react-dom/server';
import { Router } from 'express';
import doc from './document';
// import compile from 'lodash.template';
// import templateContent from './index.ejs';

// const template = compile(templateContent);

export default (chunks, App) => {
  const router = new Router();
  router.use((req, res) => {
    res.status(200);
    const sortedChunks = chunks.js.sort((a, b) => {
      if (a.indexOf('vendors') > -1) return -1;
      if (b.indexOf('vendors') > -1) return 1;
      return 0;
    });
    const Document = doc(sortedChunks, App);
    res.send(renderToString(<Document />));
  });
  return router;
};
