module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('favorite_essences', {
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
    await queryInterface.dropTable('favorite_essences');
  },
};
