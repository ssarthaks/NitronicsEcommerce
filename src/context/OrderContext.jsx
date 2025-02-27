import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const { token } = useAuth();

  const createOrderFromCart = async (userId, totalAmount, cartItems, userDetails) => {
    try {
      const response = await axios.post('/api/orders/create', {
        userId,
        totalAmount,
        cartItems,
        ...userDetails,
      });

      const newOrder = response.data.order;
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const fetchAllOrders = useCallback(async () => {
    try {
      const response = await axios.get('/api/orders/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching all orders:', error.response?.data?.message || error.message);
      throw error;
    }
  }, [token]); 

  const fetchUserOrders = async (userId) => {
    try {
      const response = await axios.get(`/api/orders/user/${userId}`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching user orders:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const fetchOrderById = async (userId, orderId) => {
    try {
      const response = await axios.get(`/api/orders/user/${userId}/order/${orderId}`);
      return response.data.order.orderItems;
    } catch (error) {
      console.error('Error fetching order by ID:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`/api/orders/${orderId}/status`, { status },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedOrder = response.data.order;

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? updatedOrder : order))
      );
    } catch (error) {
      console.error('Error updating order status:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        order,
        createOrderFromCart,
        fetchUserOrders,
        fetchOrderById,
        updateOrderStatus,
        fetchAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
