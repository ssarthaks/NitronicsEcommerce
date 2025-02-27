module.exports = (sequelize, DataTypes) => {
    const SubCategory = sequelize.define('SubCategory', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Categories', // Links to Category model
          key: 'id'
        }
      }
    },{
        tableName: 'subcategory'
    });
  
    SubCategory.associate = function(models) {
      SubCategory.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category'
      });
  
      SubCategory.hasMany(models.ChildCategory, {
        foreignKey: 'subCategoryId',
        as: 'childCategories'
      });
    };
  
    return SubCategory;
  };
  