module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mix_indications', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      description: {
        type: Sequelize.TEXT,
      },
      essence1_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      essence2_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      essence1_brand: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      essence2_brand: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'flavor_categories', key: 'id' },
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      author_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
      },
      essence1_proportion: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      essence2_proportion: {
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
    await queryInterface.dropTable('mix_indications');
  },
};
