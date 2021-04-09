/* eslint-disable no-underscore-dangle */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import * as Sentry from '@sentry/node';
import path from 'path';
import Youch from 'youch';
import 'express-async-errors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import firebase from 'firebase-admin';
import firebaseServiceAccount from '../serviceAccountKey';

import routes from './routes';
import sentryConfig from './config/sentry';

import './database';
import './passport';

const app = express();

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseServiceAccount),
});

Sentry.init(sentryConfig);

app.use(Sentry.Handlers.requestHandler());

app.use(cors({ maxAge: 86400 }));

// Helmet helps to secure express apps by setting various HTTP headers
app.use(helmet());

// Limit requests by IP
app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    handler: (_, res) =>
      res.status(429).json({
        error:
          'Muitas requisições foram feitas do seu IP. Tente novamente em alguns minutos',
      }),
  })
);

// Make server recognize the requests as JSON objects
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure passport to help on authentication
app.use(passport.initialize());

// Serve the pictures
app.use(
  '/images',
  express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
);

// Routes
app.use(routes);

app.use(Sentry.Handlers.errorHandler());

// Express exception handler
app.use(async (err, req, res, _next) => {
  if (process.env.NODE_ENV === 'development') {
    const errors = await new Youch(err, req).toJSON();
    return res.status(500).json(errors);
  }

  return res.status(500);
});

export default app;
