import { Model } from 'sequelize';

class FavoriteNarguile extends Model {
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
    this.belongsTo(models.Narguile, {
      foreignKey: 'narguile_id',
      as: 'narguile',
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default FavoriteNarguile;
