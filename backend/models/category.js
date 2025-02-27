module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },{
        tableName: 'category'
    });
  
    Category.associate = function(models) {
      Category.hasMany(models.SubCategory, {
        foreignKey: 'categoryId',
        as: 'subCategories'
      });
    };
  
    return Category;
  };
  