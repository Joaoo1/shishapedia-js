import Sequelize, { Model } from 'sequelize';

class MixIndication extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        essence1Name: Sequelize.STRING,
        essence2Name: Sequelize.STRING,
        essence1Brand: Sequelize.STRING,
        essence2Brand: Sequelize.STRING,
        essence1Proportion: Sequelize.TINYINT,
        essence2Proportion: Sequelize.TINYINT,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
    this.belongsTo(models.FlavorCategory, {
      foreignKey: 'categoryId',
      as: 'category',
    });
  }
}

export default MixIndication;
