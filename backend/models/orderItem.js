module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Order', // Reference to the orders table
          key: 'id',
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Product', // Reference to the products table
          key: 'id',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // Default quantity is 1
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // Price at the time of order
      },
    }, {
      tableName: 'orderItems',
      timestamps: true,
    });
  
    OrderItem.associate = function (models) {
      // An order item belongs to an order
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order',
      });
  
      // An order item belongs to a product
      OrderItem.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      });
    };
  
    return OrderItem;
  };
  