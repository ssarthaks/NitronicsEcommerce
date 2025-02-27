import React, { useEffect, useState } from "react";
import { useOrder } from "../../context/OrderContext";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const { orders, fetchAllOrders, updateOrderStatus, fetchOrderById } =
    useOrder();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [expandedOrderItems, setExpandedOrderItems] = useState([]);
  const [sortedOrders, setSortedOrders] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await fetchAllOrders();
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [fetchAllOrders]);

  useEffect(() => {
    setSortedOrders(orders);
  }, [orders]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success("Order status updated successfully.");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  const handleToggle = async (order) => {
    if (expandedOrderId === order.id) {
      setExpandedOrderId(null);
      setExpandedOrderItems([]);
    } else {
      setExpandedOrderId(order.id);
      try {
        const orderItems = await fetchOrderById(order.user.id, order.id);
        if (Array.isArray(orderItems)) {
          setExpandedOrderItems(orderItems);
        } else {
          console.error(
            "Order items are not in the expected format:",
            orderItems
          );
          setExpandedOrderItems([]);
        }
      } catch (error) {
        console.error("Error fetching order items:", error);
        toast.error("Failed to fetch order items. Please try again.");
        setExpandedOrderItems([]);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString)
      .toLocaleString("en-GB", options)
      .replace(",", "");
  };

  if (loading) {
    return <div className="text-center py-4">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (orders.length === 0) {
    return <div>No orders available.</div>;
  }

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sorted = [...sortedOrders].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setSortedOrders(sorted);
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "△";
  };

  const handleSearch = (order) => {
    const query = searchQuery.toLowerCase();
    const userName =
      `${order.user?.firstName} ${order.user?.lastName}`.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      userName.includes(query) ||
      order.user?.email.toLowerCase().includes(query) ||
      order.user?.phoneNumber.includes(query)
    );
  };

  const handleDateFilter = (order) => {
    const orderDate = new Date(order.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return orderDate >= start && orderDate <= end;
    } else if (start) {
      return orderDate >= start;
    } else if (end) {
      return orderDate <= end;
    }
    return true;
  };

  const filteredOrders = sortedOrders.filter(
    (order) => handleSearch(order) && handleDateFilter(order)
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <div className="mb-4">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search order by ID, name, or email"
          className="p-2 border rounded mr-4"
        />
        <label className="mr-2">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded mr-4"
        />
        <label className="mr-2">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border text-start">Order ID</th>
            <th className="p-2 border text-start">User Name</th>
            <th className="p-2 border text-start">Email</th>
            <th className="p-2 border text-start">Phone Number</th>
            <th className="p-2 border text-start">Total Amount</th>
            <th className="p-2 border text-start">Status</th>
            <th
              className="p-2 border text-start"
              onClick={() => handleSort("createdAt")}
            >
              Order Date <span>{getSortIndicator("createdAt")}</span>
            </th>
            <th className="p-2 border text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <React.Fragment key={order.id}>
              <tr className="border-b" key={order.id}>
                {" "}
                {/* Add the key here */}
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">{`${order.user?.firstName} ${order.user?.lastName}`}</td>
                <td className="p-2 border">{order.user?.email}</td>
                <td className="p-2 border">{order.user?.phoneNumber}</td>
                <td className="p-2 border">Rs. {order.totalAmount}</td>
                <td className="p-2 border">{order.status}</td>
                <td className="p-2 border">{formatDate(order.createdAt)}</td>
                <td className="p-2 border">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="bg-gray-100 p-1 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => handleToggle(order)}
                    className="ml-2 bg-blue-500 text-white p-1 rounded hover:bg-blue-700"
                  >
                    {expandedOrderId === order.id ? "Hide Items" : "View Items"}
                  </button>
                </td>
              </tr>
              {expandedOrderId === order.id && (
                <tr>
                  <td colSpan="7" className="py-3 px-6 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-2">Order Items:</h3>
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
                          <th className="py-2 px-4 text-left">Product Name</th>
                          <th className="py-2 px-4 text-left">Category</th>
                          <th className="py-2 px-4 text-left">Price</th>
                          <th className="py-2 px-4 text-left">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expandedOrderItems.map((item) => (
                          <tr key={item.product.id} className="border-b">
                            <td className="py-2 px-4">{item.product.name}</td>
                            <td className="py-2 px-4">
                              {item.product.category}
                            </td>
                            <td className="py-2 px-4">Rs. {item.price}</td>
                            <td className="py-2 px-4">{item.quantity}</td>
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
  );
};

export default AdminOrders;
