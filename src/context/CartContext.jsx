import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUserAuth } from './UserAuthContext';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useOrder } from './OrderContext'; 

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { token } = useUserAuth();
  const userId = token ? jwtDecode(token).id : null;
  const { createOrderFromCart } = useOrder();
  const fetchCart = async (userId) => {
    try {
      const response = await axios.get(`/api/cart/view-cart/${userId}`);
      setCartItems(response.data.cartItems);      
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCart(userId);
    }
  }, [userId]);

  const addToCart = async (productId, quantity) => {
    if (!token) {
      toast.error('Please login');
      return;
    }
    try {
      await axios.post('/api/cart/add-to-cart', {
        userId,
        productId,
        quantity: quantity || 1,
      });
      toast.success('Product added to cart successfully!');
      fetchCart(userId);
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('Failed to add product to cart.');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await axios.delete(`/api/cart/remove-item/${cartItemId}`);
      toast.success('Item removed from cart.');
      fetchCart(userId);
    } catch (err) {
      console.error('Error removing item from cart:', err);
      toast.error('Failed to remove item from cart.');
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const checkoutCart = async (total) => {
    if (!token) {
      toast.error('Please login to proceed to checkout.');
      return;
    }
    try {
      await createOrderFromCart(userId, total);
      clearCart();
      toast.success('Order created successfully!');
    } catch (error) {
      if(error.message === 'Request failed with status code 403'){
        console.log('user not verified')
        toast.error('User Not Verified')
      }
      else{
        toast.error('Failed to create order.');
        console.error('Error creating order from cart:', error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, handleRemoveItem, clearCart, checkoutCart }}>
      {children}
    </CartContext.Provider>
  );
};
