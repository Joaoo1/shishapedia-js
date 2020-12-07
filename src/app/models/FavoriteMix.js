import { Model } from 'sequelize';

class FavoriteMix extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Mix, {
      foreignKey: 'mix_id',
      as: 'mix',
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default FavoriteMix;
