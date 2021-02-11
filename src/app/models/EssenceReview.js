import Sequelize, { Model } from 'sequelize';

class EssenceReview extends Model {
  static init(sequelize) {
    super.init(
      {
        comment: Sequelize.STRING,
        rating: Sequelize.TINYINT,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Essence, { foreignKey: 'essence_id', as: 'essence' });
  }
}

export default EssenceReview;
