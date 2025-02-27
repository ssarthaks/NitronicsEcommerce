module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
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
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending', // Default status for new orders
      },
    }, {
      tableName: 'orders',
      timestamps: true,
    });
  
    Order.associate = function (models) {
      // An order belongs to a user
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
  
      // An order has many order items
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'orderItems',
      });
    };
  
    return Order;
  };
  