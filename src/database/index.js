import Sequelize from 'sequelize';

import dbConfig from '../config/database';

import User from '../app/models/User';
import Image from '../app/models/Image';
import Brand from '../app/models/Brand';
import Essence from '../app/models/Essence';
import NarguileItem from '../app/models/NarguileItem';
import Mix from '../app/models/Mix';
import FlavorCategory from '../app/models/FlavorCategory';
import EssenceReview from '../app/models/EssenceReview';
import NarguileItemType from '../app/models/NarguileItemType';
import FavoriteEssence from '../app/models/FavoriteEssence';
import FavoriteNarguileItem from '../app/models/FavoriteNarguileItem';
import FavoriteMix from '../app/models/FavoriteMix';
import Feedback from '../app/models/Feedback';
import HelpRequest from '../app/models/HelpRequest';
import Notification from '../app/models/Notification';
import MixIndication from '../app/models/MixIndication';

const models = [
  User,
  Image,
  Brand,
  Essence,
  NarguileItem,
  FlavorCategory,
  Mix,
  EssenceReview,
  NarguileItemType,
  FavoriteEssence,
  FavoriteNarguileItem,
  FavoriteMix,
  Feedback,
  HelpRequest,
  Notification,
  MixIndication,
];

function Database() {
  const connection = new Sequelize(dbConfig);
  models.map((model) => model.init(connection));
  models.map((model) => model.associate && model.associate(connection.models));
}

export default Database();
