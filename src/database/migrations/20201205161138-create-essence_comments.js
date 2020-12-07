module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('essence_comments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      essence_id: {
        type: Sequelize.INTEGER,
        references: { model: 'essences', key: 'id' },
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        allowNull: false,
        unique: true,
      },
      comment: {
        type: Sequelize.STRING,
      },
      rate: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('essence_comments');
  },
};
