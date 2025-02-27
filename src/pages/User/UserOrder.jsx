import React, { useEffect, useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { AiOutlineFilter } from 'react-icons/ai';

const UserOrder = ({ userId }) => {
  const { orders, fetchUserOrders, fetchOrderById } = useOrder();
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [expandedOrderItems, setExpandedOrderItems] = useState([]);
  const [sortedOrders, setSortedOrders] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    fetchUserOrders(userId);
  }, [userId]);

  useEffect(() => {
    setSortedOrders(orders);
  }, [orders]);

  const handleToggle = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setExpandedOrderItems([]);
    } else {
      setExpandedOrderId(orderId);
      try {
        const orderItems = await fetchOrderById(userId, orderId);
        if (Array.isArray(orderItems)) {
          setExpandedOrderItems(orderItems);
        } else {
          console.error('Order items are not in the expected format:', orderItems);
          setExpandedOrderItems([]);
        }
      } catch (error) {
        console.error('Error fetching order items:', error);
        setExpandedOrderItems([]);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(dateString).toLocaleString('en-GB', options).replace(',', '');
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sorted = [...sortedOrders].sort((a, b) => {
      const aValue = key === 'createdAt' ? new Date(a[key]) : a[key];
      const bValue = key === 'createdAt' ? new Date(b[key]) : b[key];

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setSortedOrders(sorted);
    setSortConfig({ key, direction });
  };

  const handleSortbyPrice = (key) => {
    let direction = 'ascending';
  
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
  
    const sorted = [...sortedOrders].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];
  
      aValue = typeof aValue === 'string' ? parseFloat(aValue.replace(/[^0-9.-]+/g,"")) : aValue;
      bValue = typeof bValue === 'string' ? parseFloat(bValue.replace(/[^0-9.-]+/g,"")) : bValue;
  
      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  
    setSortedOrders(sorted);
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '△';
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold md:mb-8">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-800 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('id')}>
                    Order ID <span>{getSortIndicator('id')}</span>
                  </th>
                  <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSortbyPrice('totalAmount')}>
                    Total Amount <span>{getSortIndicator('totalAmount')}</span>
                  </th>
                  <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('createdAt')}>
                    Order Date <span>{getSortIndicator('createdAt')}</span>
                  </th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-black text-base font-medium">
                {sortedOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-6">{order.id}</td>
                      <td className="py-3 px-6">Rs. {order.totalAmount}</td>
                      <td className="py-3 px-6">{formatDate(order.createdAt)}</td>
                      <td className="py-3 px-6">{order.status}</td>
                      <td className="py-3 px-6">
                        <button
                          onClick={() => handleToggle(order.id)}
                          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 duration-300"
                        >
                          {expandedOrderId === order.id ? 'Hide Items' : 'View Items'}
                        </button>
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr>
                        <td colSpan="5" className="py-3 px-6 bg-gray-700">
                          <h3 className="text-lg font-semibold mb-2">Order Items:</h3>
                          <table className="min-w-full bg-black border border-gray-200">
                            <thead>
                              <tr className="bg-gray-800 text-sm leading-normal">
                                <th className="py-2 px-4 text-left">Product Name</th>
                                <th className="py-2 px-4 text-left">Category</th>
                                <th className="py-2 px-4 text-left">Price</th>
                                <th className="py-2 px-4 text-left">Quantity</th>
                                <th className="py-2 px-4 text-left">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {expandedOrderItems.map((item) => (
                                <tr key={item.id} className="border-b border-gray-200">
                                  <td className="py-2 px-4">{item.product.name}</td>
                                  <td className="py-2 px-4">{item.product.category}</td>
                                  <td className="py-2 px-4">Rs. {item.price}</td>
                                  <td className="py-2 px-4">{item.quantity}</td>
                                  <td className="py-2 px-4">Rs. {item.price * item.quantity}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden flex justify-between items-center border-b">
            <div
              className="flex items-center text-lg bg-gray-800 px-4 py-2 rounded-lg shadow-md mb-4 duration-300"
              onClick={() => handleSort('createdAt')}
            >
              <AiOutlineFilter size={24} className="mr-2" />
              Newest to Oldest
            </div>
            <div
              className="flex items-center text-lg bg-gray-800 px-4 py-2 rounded-lg shadow-md mb-4 duration-300"
              onClick={() => handleSortbyPrice('totalAmount')}
            >
              <AiOutlineFilter size={24} className="mr-2" />
              Highest to Lowest
            </div>
          </div>
          <div className="md:hidden">
            {sortedOrders.map((order) => (
              <div key={order.id} className="mb-4 border border-gray-300 p-4 bg-black shadow-md">
                <div className="flex justify-between items-center">
                  <table>
                    <tr>
                      <td className="font-semibold">Order ID: {order.id}</td>
                    </tr>
                    <tr>
                      <td>
                        <span className="font-semibold">Total Amount:</span> Rs. {order.totalAmount}
                      </td>
                    </tr>
                    <p><span className="font-semibold">Order Date:</span> {formatDate(order.createdAt)}</p>
                    <p><span className="font-semibold">Status:</span> {order.status}</p>
                    <button
                      onClick={() => handleToggle(order.id)}
                      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 duration-300"
                    >
                      {expandedOrderId === order.id ? 'Hide Items' : 'View Items'}
                    </button>
                  </table>
                </div>
                {expandedOrderId === order.id && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Order Items:</h3>
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
                          <th className="py-2 px-4 text-left">Product Name</th>
                          <th className="py-2 px-4 text-left">Category</th>
                          <th className="py-2 px-4 text-left">Price</th>
                          <th className="py-2 px-4 text-left">Quantity</th>
                          <th className="py-2 px-4 text-left">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expandedOrderItems.map((item) => (
                          <tr key={item.id} className="border-b border-gray-200">
                            <td className="py-2 px-4">{item.product.name}</td>
                            <td className="py-2 px-4">{item.product.category}</td>
                            <td className="py-2 px-4">Rs. {item.price}</td>
                            <td className="py-2 px-4">{item.quantity}</td>
                            <td className="py-2 px-4">Rs. {item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
