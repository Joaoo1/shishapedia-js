import { Router } from 'express';
import multer from 'multer';
import passport from 'passport';
import rateLimit from 'express-rate-limit';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ImageController from './app/controllers/ImageController';
import BrandController from './app/controllers/BrandController';
import NarguileBrandController from './app/controllers/NarguileBrandController';
import EssenceBrandController from './app/controllers/EssenceBrandController';
import EssenceController from './app/controllers/EssenceController';
import NarguileController from './app/controllers/NarguileController';
import MixController from './app/controllers/MixController';
import EssenceReviewController from './app/controllers/EssenceReviewController';
import FavoriteNarguileController from './app/controllers/FavoriteNarguileController';
import FavoriteEssenceController from './app/controllers/FavoriteEssenceController';
import FavoriteMixController from './app/controllers/FavoriteMixController';
import FlavorCategoryController from './app/controllers/FlavorCategoryController';
import EssenceMixController from './app/controllers/EssenceMixController';
import GoogleSessionController from './app/controllers/GoogleSessionController';
import FacebookSessionController from './app/controllers/FacebookSessionController';
import MixSearchController from './app/controllers/MixSearchController';
import FeedbackController from './app/controllers/FeedbackController';
import HelpRequestController from './app/controllers/HelpRequestController';
import EssenceSearchController from './app/controllers/EssenceSearchController';
import UnreadNotificationController from './app/controllers/UnreadNotificationController';
import RecoverPassword from './app/controllers/RecoverPassword';
import NotificationController from './app/controllers/NotificationController';
import MixIndicationController from './app/controllers/MixIndicationController';
import RemoteNotificationController from './app/controllers/RemoteNotificationController';

import multerConfig from './config/multer';

import authUserMiddleware from './app/middlewares/authUser';
import authModeratorMiddleware from './app/middlewares/authModerator';
import { compressImageToIcon, createMixImage } from './app/utils/FileHelper';

const routes = Router();
const upload = multer(multerConfig).single('image');

routes.post('/recover_password', RecoverPassword.recover);
routes.post('/reset_password', RecoverPassword.resetPassword);

const createAccountLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  handler: (_, res) =>
    res.status(429).json({
      error:
        'Muitas tentativas foram feitas do seu IP. Tente novamente em meia hora',
    }),
});

routes.post('/users', createAccountLimiter, UserController.store);

routes.get('/essences_search/:brand_id', EssenceSearchController.index);
routes.get('/essences/:brand_id/', EssenceController.index);
routes.get('/essence/:id', EssenceController.show);
routes.get('/essence/:id/reviews', EssenceReviewController.index);

routes.get('/narguiles', NarguileController.index);

routes.get('/brands/essences', EssenceBrandController.index);
routes.get('/brands/narguiles', NarguileBrandController.index);

routes.get('/flavor_categories', FlavorCategoryController.index);
routes.get('/mix_search', MixSearchController.index);
routes.get('/mixes/:category_id', MixController.index);
routes.get('/essence_mixes/:essence_id', EssenceMixController.index);

routes.post('/feedbacks', FeedbackController.store);

routes.post('/help_requests', HelpRequestController.store);

routes.patch(
  '/images',
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res
              .status(400)
              .json({ error: 'Tamanho máximo permitido é de 3MB.' });
          }
        }

        return res.status(500).json({ error: err.message });
      }

      return next();
    });
  },
  compressImageToIcon,
  ImageController.store
);

// Email auth
routes.post('/auth/email', SessionController.store);

// Google Oauth2
routes.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/user.birthday.read',
    ],
  })
);
// Google Oauth2 callback url
routes.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  GoogleSessionController.store
);

// facebook Oauth2
routes.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'user_birthday'],
  })
);

// Facebook Oauth2 callback url
routes.get(
  '/auth/facebook/callback',
  function (req, res, next) {
    if (req.query && !req.query.error && req.query.error_code) {
      req.query.error = true;
    }
    next();
  },
  passport.authenticate('facebook'),
  FacebookSessionController.store
);

routes.post('/mix_indication', MixIndicationController.store);

/**
 * Leave the public routes above the authentication middleware
 * and can be accessed by everyone, on the other hand
 * the private routes should stay below the middleware
 */
routes.use(authUserMiddleware);

routes.put('/users', UserController.update);
routes.get('/users', UserController.show);
routes.delete('/users', UserController.delete);

routes.post('/essence/:id/reviews', EssenceReviewController.store);
routes.put('/essence/:id/reviews', EssenceReviewController.update);
routes.delete('/essence_review/:reviewId', EssenceReviewController.destroy);

routes.post('/favorite_narguile', FavoriteNarguileController.store);
routes.get(
  '/favorite_narguile/:narguile_id/',
  FavoriteNarguileController.index
);

routes.get('/favorite_essences', FavoriteEssenceController.index);
routes.post('/favorite_essence', FavoriteEssenceController.store);
routes.get('/favorite_essence/:essence_id', FavoriteEssenceController.show);
routes.delete(
  '/favorite_essence/:essence_id',
  FavoriteEssenceController.destroy
);

routes.post('/favorite_mix', FavoriteMixController.store);
routes.get('/favorite_mix/:mix_id', FavoriteMixController.show);
routes.get('/favorite_mixes', FavoriteMixController.index);
routes.delete('/favorite_mix/:mix_id', FavoriteMixController.destroy);

routes.get('/unread_notifications', UnreadNotificationController.index);
routes.get('/notifications', NotificationController.index);
routes.put('/notifications', NotificationController.update);

routes.put('/remote_notifications', RemoteNotificationController.update);
routes.delete('/remote_notifications', RemoteNotificationController.delete);

routes.delete('/notifications/:notificationId', NotificationController.delete);

// Routes just available for moderators
routes.use(authModeratorMiddleware);

routes.post('/brands', BrandController.store);
routes.put('/brands/:id', BrandController.update);

routes.post('/essences', EssenceController.store);
routes.put('/essences', EssenceController.update);

routes.post('/narguiles', NarguileController.store);
routes.put('/narguiles', NarguileController.update);

routes.post('/flavor_categories', FlavorCategoryController.store);
routes.post('/mixes', createMixImage, compressImageToIcon, MixController.store);
routes.put('/mixes', MixController.update);

export default routes;
