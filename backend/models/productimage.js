'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      ProductImage.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    }
  }

  ProductImage.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    url: DataTypes.STRING,
    productId: DataTypes.UUID,
  }, {
    sequelize,
    tableName: 'ProductImage',
    modelName: 'ProductImage',
  });

  return ProductImage;
};
