const { Cart, CartItem, Product } = require('../models');

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body; 
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId: product.id,
      },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId: product.id,
        quantity: quantity || 1, 
      });
    }

    return res.status(200).json({ message: 'Product added to cart successfully', cartItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const viewCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({
      where: { userId },
      attributes: {exclude: ['createdAt', 'updatedAt']},
      include: [
        {
          model: CartItem,
          as: 'cartItems', 
          attributes: {exclude: ['createdAt', 'updatedAt']},
          include: [
            {
              model: Product,
              as: 'product', 
              attributes: { exclude: [ 'isFeatured', 'createdAt', 'updatedAt','category', 'subCategory', 'childCategory'] }, 
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const removeItemFromCart = async (req, res) => {
    try {
      const { cartItemId } = req.params;
  
      const cartItem = await CartItem.findByPk(cartItemId);
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      // Remove the cart item
      await cartItem.destroy();
  
      return res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
  addToCart,
  viewCart,
  removeItemFromCart 
};
