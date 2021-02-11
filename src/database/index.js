import Sequelize from 'sequelize';

import dbConfig from '../config/database';

import User from '../app/models/User';
import Image from '../app/models/Image';
import Brand from '../app/models/Brand';
import Essence from '../app/models/Essence';
import Narguile from '../app/models/Narguile';
import Mix from '../app/models/Mix';
import FlavorCategory from '../app/models/FlavorCategory';
import EssenceReview from '../app/models/EssenceReview';
import NarguileItemType from '../app/models/NarguileItemType';
import FavoriteEssence from '../app/models/FavoriteEssence';
import FavoriteNarguile from '../app/models/FavoriteNarguile';
import FavoriteMix from '../app/models/FavoriteMix';
import Feedback from '../app/models/Feedback';
import HelpRequest from '../app/models/HelpRequest';
import Notification from '../app/models/Notification';

const models = [
  User,
  Image,
  Brand,
  Essence,
  Narguile,
  FlavorCategory,
  Mix,
  EssenceReview,
  NarguileItemType,
  FavoriteEssence,
  FavoriteNarguile,
  FavoriteMix,
  Feedback,
  HelpRequest,
  Notification,
];

function Database() {
  const connection = new Sequelize(dbConfig);
  models.map((model) => model.init(connection));
  models.map((model) => model.associate && model.associate(connection.models));
}

export default Database();
