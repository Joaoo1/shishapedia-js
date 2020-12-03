import 'dotenv/config';

export default {
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: '0.5',
};
