import Sequelize, { Model } from 'sequelize';

class Narguile extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        size: Sequelize.ENUM(['P', 'M', 'G']),
        description: Sequelize.STRING,
        release_date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Image, { foreignKey: 'image_id', as: 'image' });
    this.belongsTo(models.Brand, { foreignKey: 'brand_id', as: 'brand' });
    this.belongsTo(models.NarguileItemType, {
      foreignKey: 'type_id',
      as: 'type',
    });
  }
}

export default Narguile;
