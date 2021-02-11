import Sequelize, { Model } from 'sequelize';

class FlavorCategory extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Image, { foreignKey: 'icon_id', as: 'icon' });
  }
}

export default FlavorCategory;
