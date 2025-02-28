import React, { useEffect, useState } from "react";
import { useOrder } from "../../context/OrderContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

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
    return <div className="text-center py-4 text-white">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-white">No orders available.</div>;
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
    <motion.div
      className="container mx-auto py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4 text-white">All Orders</h1>
      <div className="mb-4 flex flex-wrap gap-4">
        <motion.input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search order by ID, name, or email"
          className="p-2 border rounded bg-nitro-gray-700 text-white border-nitro-gray-600 focus:outline-none focus:ring-2 focus:ring-nitro-accent"
          whileFocus={{ scale: 1.02 }}
        />
        <div className="flex items-center">
          <label className="mr-2 text-white">Start Date:</label>
          <motion.input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded bg-nitro-gray-700 text-white border-nitro-gray-600 focus:outline-none focus:ring-2 focus:ring-nitro-accent"
            whileFocus={{ scale: 1.02 }}
          />
        </div>
        <div className="flex items-center">
          <label className="mr-2 text-white">End Date:</label>
          <motion.input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded bg-nitro-gray-700 text-white border-nitro-gray-600 focus:outline-none focus:ring-2 focus:ring-nitro-accent"
            whileFocus={{ scale: 1.02 }}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-nitro-gray-700">
          <thead>
            <tr className="bg-nitro-gray-800">
              <th className="p-2 border border-nitro-gray-700 text-start text-white">
                Order ID
              </th>
              <th className="p-2 border border-nitro-gray-700 text-start text-white">
                User Name
              </th>
              <th className="p-2 border border-nitro-gray-700 text-start text-white">
                Email
              </th>
              <th className="p-2 border border-nitro-gray-700 text-start text-white">
                Phone Number
              </th>
              <th className="p-2 border border-nitro-gray-700 text-start text-white">
                Total Amount
              </th>
              <th className="p-2 border border-nitro-gray-700 text-start text-white">
                Status
              </th>
              <th
                className="p-2 border border-nitro-gray-700 text-start text-white cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                Order Date <span>{getSortIndicator("createdAt")}</span>
              </th>
              <th className="p-2 border border-nitro-gray-700 text-start text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <motion.tr
                    className="border-b border-nitro-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="p-2 border border-nitro-gray-700 text-white">
                      {order.id}
                    </td>
                    <td className="p-2 border border-nitro-gray-700 text-white">{`${order.user?.firstName} ${order.user?.lastName}`}</td>
                    <td className="p-2 border border-nitro-gray-700 text-white">
                      {order.user?.email}
                    </td>
                    <td className="p-2 border border-nitro-gray-700 text-white">
                      {order.user?.phoneNumber}
                    </td>
                    <td className="p-2 border border-nitro-gray-700 text-white">
                      Rs. {order.totalAmount}
                    </td>
                    <td className="p-2 border border-nitro-gray-700 text-white">
                      {order.status}
                    </td>
                    <td className="p-2 border border-nitro-gray-700 text-white">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-2 border border-nitro-gray-700 flex flex-col gap-2">
                      <motion.select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="bg-nitro-gray-700 text-white p-1 rounded border border-nitro-gray-600 focus:outline-none focus:ring-2 focus:ring-nitro-accent"
                        whileHover={{ scale: 1.05 }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </motion.select>
                      <motion.button
                        onClick={() => handleToggle(order)}
                        className="bg-nitro-accent text-nitro-black p-1 rounded hover:bg-yellow-300 transition"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {expandedOrderId === order.id
                          ? "Hide Items"
                          : "View Items"}
                      </motion.button>
                    </td>
                  </motion.tr>
                  <AnimatePresence>
                    {expandedOrderId === order.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td colSpan="8" className="py-3 px-6 bg-nitro-gray-800">
                          <h3 className="text-lg font-semibold mb-2 text-white">
                            Order Items:
                          </h3>
                          <table className="min-w-full bg-nitro-gray-700 border border-nitro-gray-600">
                            <thead>
                              <tr className="bg-nitro-gray-800 text-nitro-gray-300 text-sm leading-normal">
                                <th className="py-2 px-4 text-left">
                                  Product Name
                                </th>
                                <th className="py-2 px-4 text-left">
                                  Category
                                </th>
                                <th className="py-2 px-4 text-left">Price</th>
                                <th className="py-2 px-4 text-left">
                                  Quantity
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {expandedOrderItems.map((item) => (
                                <motion.tr
                                  key={item.product.id}
                                  className="border-b border-nitro-gray-600"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <td className="py-2 px-4 text-white">
                                    {item.product.name}
                                  </td>
                                  <td className="py-2 px-4 text-white">
                                    {item.product.category}
                                  </td>
                                  <td className="py-2 px-4 text-white">
                                    Rs. {item.price}
                                  </td>
                                  <td className="py-2 px-4 text-white">
                                    {item.quantity}
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminOrders;
