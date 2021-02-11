module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mixes', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      description: {
        type: Sequelize.TEXT,
      },
      essence1_id: {
        type: Sequelize.INTEGER,
        references: { model: 'essences', key: 'id' },
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      essence2_id: {
        type: Sequelize.INTEGER,
        references: { model: 'essences', key: 'id' },
        onUpdate: 'CASCADE',
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
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      image_id: {
        type: Sequelize.INTEGER,
        references: { model: 'images', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      icon_id: {
        type: Sequelize.INTEGER,
        references: { model: 'images', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
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
    await queryInterface.dropTable('mixes');
  },
};
