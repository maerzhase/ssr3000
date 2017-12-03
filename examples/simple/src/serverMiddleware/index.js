import React from 'react';
import { renderToString } from 'react-dom/server';
import { Router } from 'express';
import compile from 'lodash.template';
import templateContent from './index.ejs';
import App from '../components/App';

const template = compile(templateContent);

export default (chunks) => {
  const router = new Router();
  router.use((req, res) => {
    res.status(200);
    res.send(template({
      chunks,
      app: renderToString(<App />),
    }));
  });
  return router;
};
