const nodemailer = require('nodemailer');
const { Order, OrderItem, Cart, CartItem, Product, User } = require('../models');
require('dotenv').config();
const createOrderFromCart = async (req, res) => {
  const { userId, totalAmount, firstName, lastName, email, phoneNumber } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(!user.emailVerified){
      return res.status(403).json({ message: "User is not verified" });
    }

    const cart = await Cart.findOne({
      where: { userId },
      include: {
        model: CartItem,
        as: 'cartItems',
        include: {
          model: Product,
          as: 'product',
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ message: "No items in the cart to place an order" });
    }

    const order = await Order.create({
      userId,
      totalAmount,
      status: 'pending',
      firstName,
      lastName,
      email,
      phoneNumber
    });

    const orderItems = await Promise.all(
      cart.cartItems.map(async (cartItem) => {
        const { productId, quantity, product } = cartItem;
        return OrderItem.create({
          orderId: order.id,
          productId: productId,
          quantity: quantity,
          price: product.price,
        });
      })
    );

    // Clear the cart after placing the order
    await CartItem.destroy({ where: { cartId: cart.id } });

    await sendOrderConfirmationEmail(user, order, orderItems);


    return res.status(201).json({ order, orderItems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while creating the order" });
  }
};

// Get all orders for a specific user
const getUserOrders = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed in params

  try {
    // Check if the userId is valid by finding the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: {
            model: Product,
            as: 'product',
          },
        },
      ],
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while fetching orders" });
  }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
  const { userId, orderId } = req.params;

  try {
    // Check if the userId is valid by finding the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: {
            model: Product,
            as: 'product',
            attributes: {exclude: ['createdAt', 'id', 'isFeatured', 'subCategory', 'updatedAt', 'images', 'childCategory']}
          },
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to view this order" });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while fetching the order" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while updating the order status" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: User,
        as: 'user', 
        attributes: ['id', 'firstName', 'lastName','email','phoneNumber'], 
      }],
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};

const sendOrderConfirmationEmail = async (user, order, orderItems) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: 'augi dapi iumy bzfl', 
      },
    });

    const productPromises = orderItems.map(async (item) => {
      const product = await Product.findOne({ where: { id: item.dataValues.productId } });
      return {
        productName: product ? product.name : 'Unknown Product',
        quantity: item.dataValues.quantity,
        price: item.dataValues.price,
      };
    });

    const products = await Promise.all(productPromises);

    let orderDetails = products.map(item => {
      return `<li>${item.productName} - Quantity: ${item.quantity}, Price: Rs.${item.price}</li>`;
    }).join('');

    const customerMailOptions = {
      from: 'Nitronics Gaming Store', 
      to: user.email, 
      subject: 'Order Confirmation - Thank You for Your Purchase!',
      html: `
        <h1>Thank you for your order, ${user.firstName} ${user.lastName}!</h1>
        <p>We have received your order and will start processing it soon. Here are the details:</p>
        <ul>
          ${orderDetails}
        </ul>
        <p>Total Amount: Rs.${order.totalAmount}</p>
        <br>
        <p>Nitronics Gaming Store</p>
        <p>Naxal, Kathmandu</p>
        <p>If this wasn't you, Please contact Nitronics Gaming Store Nepal</p>
        <p>We will notify you once your order is shipped.</p>
        <p>Thank you for shopping with us!</p>
      `,
    };

    const adminMailOptions = {
      from: 'Nitronics Gaming Store',
      to: process.env.EMAIL_USER, 
      subject: `New Order Placed by ${user.firstName} ${user.lastName}`,
      html: `
        <h1>New Order Received from ${user.firstName} ${user.lastName}</h1>
        <p>Order details:</p>
        <ul>
          ${orderDetails}
        </ul>
        <p>Total Amount: Rs.${order.totalAmount}</p>
        <p>User Email: ${user.email}</p>
        <p>User Phone Number: ${user.phoneNumber} </p>
      `,
    };

    await transporter.sendMail(customerMailOptions);
    console.log('Order confirmation email sent to customer successfully');

    await transporter.sendMail(adminMailOptions);
    console.log('Order details sent to admin email successfully');

  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};


module.exports = {
  createOrderFromCart,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
};
