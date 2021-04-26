import { Model } from 'sequelize';

class FavoriteNarguileItem extends Model {
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
    this.belongsTo(models.NarguileItem, {
      foreignKey: 'narguile_item_id',
      as: 'narguile_item',
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default FavoriteNarguileItem;
