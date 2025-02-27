module.exports = (sequelize, DataTypes) => {
    const ChildCategory = sequelize.define('ChildCategory', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'SubCategories',
          key: 'id'
        }
      }
    },{
        tableName: 'childcategory'
    });
  
    ChildCategory.associate = function(models) {
      ChildCategory.belongsTo(models.SubCategory, {
        foreignKey: 'subCategoryId',
        as: 'subCategory'
      });
    };
  
    return ChildCategory;
  };
  