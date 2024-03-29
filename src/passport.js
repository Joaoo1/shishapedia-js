import crypto from 'crypto';
import passport from 'passport';
import GoogleOAuth from 'passport-google-oauth20';
import FacebookOAuth from 'passport-facebook';
import { Op } from 'sequelize';

import User from './app/models/User';
import Notification from './app/models/Notification';

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

        const welcomeMessage =
          'Seja bem-vindo ao Shishapedia!\n\nEste é um aplicativo desenvolvido com a intenção de ' +
          'distribuir informação do mundo do narguilé de forma rápida e limpa. \n' +
          'O app ainda está em fase de desenvolvimento e vamos tentar continuar ' +
          'adicionando novas coisas sempre que possível. Então pedimos a sua paciência ' +
          'e colaboração. \nCaso queira nos ajudar, quando encontrar qualquer' +
          'problema ou ter uma ideia para o app, entre em contato conosco pela' +
          'aba Feedback ou pela aba Ajuda. \n\n Obrigado.';

        Notification.create({
          title: `Olá, ${name}`,
          message: welcomeMessage,
          user_id: newUser.id,
        });

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
      callbackURL: 'https://api.shishapedia.com.br/auth/facebook/callback',
    },
    async (accessToken, _refreshToken, profile, done) => {
      const { id: facebook_id, displayName: name, emails } = profile;

      try {
        // Check if email is already registered but
        // is not linked to a facebook account
        if (emails) {
          const emailAlreadyExists = await User.findOne({
            where: {
              email: emails[0].value,
              facebook_id: { [Op.not]: facebook_id },
            },
          });

          if (emailAlreadyExists) return done('Email already exists');
        }

        // Check if user is already registered
        const user = await User.findOne({ where: { facebook_id } });
        if (user) return done(null, user);

        // User not registered yet, so create a new one
        const newUser = await new User({
          facebook_id,
          name,
          email: emails ? emails[0].value : null,
          password: crypto.randomBytes(16).toString('hex'),
        }).save();

        const welcomeMessage =
          'Seja bem-vindo ao Shishapedia!\n\nEste é um aplicativo desenvolvido com a intenção de ' +
          'distribuir informação do mundo do narguilé de forma rápida e limpa. \n' +
          'O app ainda está em fase de desenvolvimento e vamos tentar continuar ' +
          'adicionando novas coisas sempre que possível. Então pedimos a sua paciência ' +
          'e colaboração. \nCaso queira nos ajudar, quando encontrar qualquer' +
          'problema ou ter uma ideia para o app, entre em contato conosco pela' +
          'aba Feedback ou pela aba Ajuda. \n\n Obrigado.';

        Notification.create({
          title: `Olá, ${name}`,
          message: welcomeMessage,
          user_id: newUser.id,
        });

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);
