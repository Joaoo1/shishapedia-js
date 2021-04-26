import Sequelize, { Model } from 'sequelize';

class NarguileItem extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        size: Sequelize.ENUM(['P', 'M', 'G', 'U']),
        description: Sequelize.TEXT,
        release_date: Sequelize.DATE,
        images: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Brand, { foreignKey: 'brand_id', as: 'brand' });
    this.belongsTo(models.Image, { foreignKey: 'icon_id', as: 'icon' });
    this.belongsTo(models.NarguileItemType, {
      foreignKey: 'type_id',
      as: 'type',
    });
  }
}

export default NarguileItem;
