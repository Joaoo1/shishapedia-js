import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import path from 'path';
import Youch from 'youch';
import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry';

const app = express();

Sentry.init(sentryConfig);

app.use(Sentry.Handlers.requestHandler());

app.use(cors());

// Make server recognize the requests as JSON objects
app.use(express.json());

// Serve the pictures
app.use(
  '/files',
  express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')),
);

// Routes
app.use(routes);
app.use(Sentry.Handlers.errorHandler());

// Exception handler
app.use(async (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const errors = await new Youch(err, req).toJSON();
    return res.status(500).json(errors);
  }

  return res.status(500).json({ error: 'Internal server error' });
});

export default app;
