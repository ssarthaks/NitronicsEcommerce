import React, { useState } from 'react';
import { useOrder } from './OrderContext';

const CreateOrderForm = ({ userId, cartItems, totalAmount }) => {
  const { createOrderFromCart } = useOrder();
  
  // State for user details
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Combine user details with cart items and order information
      await createOrderFromCart(userId, totalAmount, cartItems, userDetails);
      alert('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={userDetails.firstName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={userDetails.lastName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={userDetails.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={userDetails.phoneNumber}
          onChange={handleInputChange}
          required
        />
      </div>
      {/* Add more inputs like address, etc., if needed */}
      
      <button type="submit">Place Order</button>
    </form>
  );
};

export default CreateOrderForm;
