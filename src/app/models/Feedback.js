import Sequelize, { Model } from 'sequelize';

class Feedback extends Model {
  static init(sequelize) {
    super.init(
      {
        message: Sequelize.STRING,
        open: Sequelize.BOOLEAN,
        closed_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'closed_by', as: 'closedBy' });
  }
}

export default Feedback;
