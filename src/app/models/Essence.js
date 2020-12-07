import Sequelize, { Model } from 'sequelize';

class Essence extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        proposal: Sequelize.STRING,
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
  }
}

export default Essence;
