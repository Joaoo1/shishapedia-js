module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'icon_id', {
      type: Sequelize.INTEGER,
      references: { model: 'images', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
      unique: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'icon_id');
  },
};
