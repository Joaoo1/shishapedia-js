module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('notifications', 'message', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('notifications', 'message', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
