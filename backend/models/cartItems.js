module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define('CartItem', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      cartId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Cart',
          key: 'id',
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Product',
          key: 'id',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    }, {
      tableName: 'cartItems',
      timestamps: true,
    });
  
    CartItem.associate = function (models) {
      // A cart item belongs to a cart
      CartItem.belongsTo(models.Cart, {
        foreignKey: 'cartId',
        as: 'cart',
      });
  
      // A cart item belongs to a product
      CartItem.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      });
    };
  
    return CartItem;
  };
  