import Sequelize from 'sequelize';

import User from '../app/models/User';
import Image from '../app/models/Image';
import Brand from '../app/models/Brand';
import Essence from '../app/models/Essence';
import Narguile from '../app/models/Narguile';
import Mix from '../app/models/Mix';
import FlavorCategory from '../app/models/FlavorCategory';
import EssenceComment from '../app/models/EssenceComment';

import dbConfig from '../config/database';

const models = [
  User,
  Image,
  Brand,
  Essence,
  Narguile,
  FlavorCategory,
  Mix,
  EssenceComment,
];

function Database() {
  const connection = new Sequelize(dbConfig);
  models.map((model) => model.init(connection));
  models.map((model) => model.associate && model.associate(connection.models));
}

export default Database();
