import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ImageController from './app/controllers/ImageController';
import BrandController from './app/controllers/BrandController';
import EssenceController from './app/controllers/EssenceController';
import NarguileController from './app/controllers/NarguileController';
import MixController from './app/controllers/MixController';
import EssenceCommentController from './app/controllers/EssenceCommentController';
import FavoriteNarguileController from './app/controllers/FavoriteNarguileController';
import FavoriteEssenceController from './app/controllers/FavoriteEssenceController';
import FavoriteMixController from './app/controllers/FavoriteMixController';

import authUserMiddleware from './app/middlewares/authUser';
import authModeratorMiddleware from './app/middlewares/authModerator';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.get('/essences', EssenceController.index);
routes.get('/narguiles', NarguileController.index);
routes.get('/mixes', MixController.index);

/**
 * Leave the public routes above the authentication middleware
 * and can be accessed by everyone, on the other hand
 * the private routes should stay below the middleware
 */
routes.use(authUserMiddleware);

routes.post('/images', upload.single('image'), ImageController.store);

routes.put('/users', UserController.update);

routes.post('/essences/comments', EssenceCommentController.store);
routes.put('/essences/comments', EssenceCommentController.update);

routes.post('/favorite_narguile', FavoriteNarguileController.store);
routes.get('/favorite_narguile', FavoriteNarguileController.index);

routes.post('/favorite_essence', FavoriteEssenceController.store);
routes.get('/favorite_essence', FavoriteEssenceController.index);

routes.post('/favorite_mix', FavoriteMixController.store);
routes.get('/favorite_mix', FavoriteMixController.index);

// Routes just available for moderators
routes.use(authModeratorMiddleware);

routes.post('/brands', BrandController.store);
routes.put('/brands/:id', BrandController.update);

routes.post('/essences', EssenceController.store);
routes.put('/essences', EssenceController.update);

routes.post('/narguiles', NarguileController.store);
routes.put('/narguiles', NarguileController.update);

routes.post('/mixes', MixController.store);
routes.put('/mixes', MixController.update);

export default routes;
