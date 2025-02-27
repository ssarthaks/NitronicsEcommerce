// migrations/xxxx-create-childcategory.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('childcategory', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subCategoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'subcategory',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('childcategory');
  }
};
