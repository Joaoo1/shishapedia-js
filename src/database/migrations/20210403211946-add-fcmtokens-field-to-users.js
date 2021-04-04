module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'fcm_tokens', {
      type: Sequelize.ARRAY(Sequelize.STRING),
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'fcm_tokens');
  },
};
