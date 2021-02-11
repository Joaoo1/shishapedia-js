import Sequelize, { Model } from 'sequelize';

class Mix extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        essence1_proportion: Sequelize.TINYINT,
        essence2_proportion: Sequelize.TINYINT,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Essence, {
      foreignKey: 'essence1_id',
      as: 'essence1',
    });
    this.belongsTo(models.Essence, {
      foreignKey: 'essence2_id',
      as: 'essence2',
    });
    this.belongsTo(models.User, { foreignKey: 'author_id', as: 'author' });
    this.belongsTo(models.Image, { foreignKey: 'image_id', as: 'image' });
    this.belongsTo(models.Image, { foreignKey: 'icon_id', as: 'icon' });
    this.belongsTo(models.FlavorCategory, {
      foreignKey: 'category_id',
      as: 'category',
    });
  }
}

export default Mix;
