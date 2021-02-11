import { Model } from 'sequelize';

class FavoriteEssence extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );

    this.removeAttribute('id');

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Essence, {
      foreignKey: 'essence_id',
      as: 'essence',
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default FavoriteEssence;
