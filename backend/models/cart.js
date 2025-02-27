module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'User', // Assuming your user table is named 'users'
          key: 'id',
        },
      },
    }, {
      tableName: 'carts',
      timestamps: true,
    });
  
    Cart.associate = function (models) {
      // A cart belongs to a user
      Cart.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
  
      // A cart has many cart items
      Cart.hasMany(models.CartItem, {
        foreignKey: 'cartId',
        as: 'cartItems',
      });
    };
  
    return Cart;
  };
  