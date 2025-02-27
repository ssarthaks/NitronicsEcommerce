import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';

const UserCart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { cartItems, handleRemoveItem } = useCart();
  const [sortedCart, setSortedCart] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    if (cartItems) {
      setSortedCart(cartItems); 
      setLoading(false);
    } else {
      setError('Failed to load cart items.');
      setLoading(false);
    }
  }, [cartItems]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sorted = [...sortedCart].sort((a, b) => {
      if (a.product[key] < b.product[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a.product[key] > b.product[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setSortedCart(sorted);
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '△';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!cartItems || cartItems.length === 0) {
    return <div>
      <h1 className="text-3xl font-bold md:mb-8">Your Cart</h1>Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="overflow-hidden md:overflow-x-auto">
        <table className="min-w-full table-auto text-left border md:text-base text-sm">
          <thead className="hidden md:table-header-group">
            <tr className="bg-gray-800">
              <th className="p-2 border cursor-pointer" onClick={() => handleSort('name')}>
                Product {getSortIndicator('name')}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort('price')}>
                Unit Price {getSortIndicator('price')}
              </th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort('totalPrice')}>
                Total Price {getSortIndicator('totalPrice')}
              </th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCart.map((item, index) => (
              <React.Fragment key={item.id}>
                <tr className="hidden md:table-row border-b">
                  <td className="p-2 border">{item.product.name}</td>
                  <td className="p-2 border">Rs. {item.product.price}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">Rs. {item.product.price * item.quantity}</td>
                  <td className="p-2 border">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>

                {/* Mobile View*/}
                <tr className={`md:hidden ${index % 2 !== 0 ? 'bg-gray-200' : ''}`}>
                  <td className="p-2 border" colSpan="2"><strong>Product:</strong> {item.product.name}</td>
                </tr>
                <tr className={`md:hidden ${index % 2 !== 0 ? 'bg-gray-200' : ''}`}>
                  <td className="p-2 border" colSpan="2"><strong>Unit Price:</strong> Rs. {item.product.price}</td>
                </tr>
                <tr className={`md:hidden ${index % 2 !== 0 ? 'bg-gray-200' : ''}`}>
                  <td className="p-2 border" colSpan="2"><strong>Quantity:</strong> {item.quantity}</td>
                </tr>
                <tr className={`md:hidden ${index % 2 !== 0 ? 'bg-gray-200' : ''}`}>
                  <td className="p-2 border" colSpan="2"><strong>Total Price:</strong> Rs. {item.product.price * item.quantity}</td>
                </tr>
                <tr className={`md:hidden ${index % 2 !== 0 ? 'bg-gray-200' : ''}`}>
                  <td className="p-2 border" colSpan="2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="font-bold text-lg mt-4">
        Total Amount: Rs. {sortedCart.reduce((total, item) => total + item.product.price * item.quantity, 0)}
      </div>
    </div>
  );
};

export default UserCart;
