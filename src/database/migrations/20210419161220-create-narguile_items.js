module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('narguile_items', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      size: {
        type: Sequelize.ENUM(['P', 'M', 'G', 'U']),
      },
      description: {
        type: Sequelize.TEXT,
      },
      release_date: {
        type: Sequelize.DATE,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      icon_id: {
        type: Sequelize.INTEGER,
        references: { model: 'images', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
        unique: true,
      },
      brand_id: {
        type: Sequelize.INTEGER,
        references: { model: 'brands', key: 'id' },
      },
      type_id: {
        type: Sequelize.INTEGER,
        references: { model: 'narguile_item_type', key: 'id' },
        allowNull: false,
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
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
    await queryInterface.dropTable('narguile_items');
  },
};
