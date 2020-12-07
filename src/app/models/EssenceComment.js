import Sequelize, { Model } from 'sequelize';

class EssenceComment extends Model {
  static init(sequelize) {
    super.init(
      {
        comment: Sequelize.STRING,
        rate: Sequelize.TINYINT,
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

export default EssenceComment;
