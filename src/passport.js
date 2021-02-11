import crypto from 'crypto';
import passport from 'passport';
import GoogleOAuth from 'passport-google-oauth20';
import FacebookOAuth from 'passport-facebook';
import { Op } from 'sequelize';

import User from './app/models/User';

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

/* ------ GOOGLE OAUTH2 ------ */
passport.use(
  new GoogleOAuth.Strategy(
    {
      clientID:
        '31994577483-kisvdu3qa596m141cvekm2uh5ate2ocj.apps.googleusercontent.com',
      clientSecret: 'X5EK2Oz-Ng3dFml1rPNStA5Y', // Add the secret here
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, _refreshToken, profile, done) => {
      const { id: google_id, displayName: name } = profile;
      const email = profile.emails[0].value;

      try {
        // Check if email is already registered but
        // is not linked to a google account
        const emailAlreadyExists = await User.findOne({
          where: {
            email,
            google_id: { [Op.not]: google_id },
          },
        });

        if (emailAlreadyExists) return done('Email already exists');

        // Check if user is already registered
        const user = await User.findOne({ where: { google_id } });
        if (user) return done(null, user);

        // User not registered yet, so create a new one
        const newUser = await new User({
          google_id,
          name,
          email,
          password: crypto.randomBytes(16).toString('hex'),
        }).save();

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

/* ------ FACEBOOK OAUTH2 ------ */
passport.use(
  new FacebookOAuth.Strategy(
    {
      clientID: '413878719739046',
      clientSecret: 'fd4105fef062a4fd9ab546373b7283e4',
      callbackURL: '/auth/facebook/callback',
    },
    async (accessToken, _refreshToken, profile, done) => {
      const { id: facebook_id, displayName: name } = profile;
      const email = profile.emails[0].value;

      try {
        // Check if email is already registered but
        // is not linked to a facebook account
        const emailAlreadyExists = await User.findOne({
          where: {
            email,
            facebook_id: { [Op.not]: facebook_id },
          },
        });

        if (emailAlreadyExists) return done('Email already exists');

        // Check if user is already registered
        const user = await User.findOne({ where: { facebook_id } });
        if (user) return done(null, user);

        // User not registered yet, so create a new one
        const newUser = await new User({
          facebook_id,
          name,
          email,
          password: crypto.randomBytes(16).toString('hex'),
        }).save();

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);
