import React, { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineLogout,
} from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import { BsHandbag } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { useCart } from "../context/CartContext";
import { jwtDecode } from "jwt-decode";
import { useCategory } from "../context/CategoryContext";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const { token, logout } = useUserAuth();
  const { cartItems, clearCart, handleRemoveItem, checkoutCart } = useCart();
  const navigate = useNavigate();
  const userId = token ? jwtDecode(token).id : null;
  const { categories } = useCategory();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      clearCart();
    }
  }, [token]);

  const handleMouseEnter = (menuId) => {
    setActiveMenu(menuId);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleProductsDropdown = () => {
    setIsProductsOpen(!isProductsOpen);
  };

  const toggleCartSidebar = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleLogout = () => {
    logout();
    clearCart();
    navigate("/login");
  };

  const handleCreateOrder = async () => {
    try {
      setIsLoading(true);
      const total = cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      await checkoutCart(total);
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black duration-300 z-50 relative">
      <div className="flex justify-between items-center px-4 py-4 text-2xl md:px-6">
        {/* Left section */}
        <div
          className="flex space-x-4 items-center"
          style={{ flexShrink: 0, flexBasis: "10%" }}
        >
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-yellow-500 duration-300"
          >
            <RxHamburgerMenu />
          </button>
          <Link to="/products">
            <IoSearchOutline className="text-white hover:text-yellow-500 duration-300" />
          </Link>
        </div>

        {/* Brand Name */}
        <div className="font-bold text-center text-3xl flex-grow ">
          <Link
            to="/"
            className="text-white hover:text-yellow-500 duration-300"
          >
            Nitronics
          </Link>
        </div>

        {/* Right section */}
        <div
          className="flex space-x-4 items-center justify-end"
          style={{ flexShrink: 0, flexBasis: "10%" }}
        >
          {token ? (
            <>
              <Link to="/account">
                <VscAccount className="text-white hover:text-yellow-500 duration-300" />
              </Link>
              <AiOutlineLogout
                onClick={handleLogout}
                className="text-white hover:text-yellow-500 duration-300 cursor-pointer"
              />
            </>
          ) : (
            <Link to="/login">
              <VscAccount className="text-white hover:text-yellow-500 duration-300" />
            </Link>
          )}
          <BsHandbag
            onClick={toggleCartSidebar}
            className="text-white hover:text-yellow-500 duration-300 cursor-pointer"
          />
        </div>
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-[300px] bg-nitro-gray-600 text-white shadow-lg z-50"
      >
        <div className="flex justify-between p-4 border-b">
          <div onClick={toggleSidebar}>
            <Link to="/">
              <h2 className="text-xl font-semibold hover:text-yellow-500 duration-300">
                Nitronics
              </h2>
            </Link>
          </div>
          <AiOutlineClose
            size={24}
            className="cursor-pointer hover:text-yellow-500 duration-300"
            onClick={toggleSidebar}
          />
        </div>
        <div className="p-6">
          <ul className="text-xl space-y-4">
            <li>
              <div
                onClick={toggleProductsDropdown}
                className="flex justify-between items-center cursor-pointer hover:text-yellow-500 duration-300"
              >
                <span>Products</span>
                {isProductsOpen ? (
                  <AiOutlineMinus size={20} />
                ) : (
                  <AiOutlinePlus size={20} />
                )}
              </div>
              {isProductsOpen && (
                <ul className="pl-4 mt-2 max-h-[500px] overflow-hidden transition-all duration-300 ease-in-out">
                  <li>
                    <Link
                      to="/products"
                      className="hover:text-yellow-500 duration-300 py-1"
                      onClick={toggleSidebar}
                    >
                      All Products
                    </Link>
                  </li>
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className="hover:text-yellow-500 duration-300 py-1"
                    >
                      <Link
                        to={`/products?category=${encodeURIComponent(
                          category.name.replace(/ /g, "-")
                        )}`}
                        onClick={toggleSidebar}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li
              className="hover:text-yellow-500 duration-300"
              onClick={toggleSidebar}
            >
              <Link to="/about">About Us</Link>
            </li>
            <li
              className="hover:text-yellow-500 duration-300 cursor-pointer"
              onClick={() => {
                toggleCartSidebar(), toggleSidebar();
              }}
            >
              Cart
            </li>
            {token ? (
              <>
                <li className="hover:text-yellow-500 duration-300">
                  <Link to="/account">Account</Link>
                </li>
                <li
                  className="hover:text-yellow-500 duration-300 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </>
            ) : (
              <li className="hover:text-yellow-500 duration-300" onClick={toggleSidebar}>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </motion.div>

      {/* Cart Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isCartOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full md:w-[400px] text-white shadow-lg z-50 bg-nitro-gray-600"
      >
        <div className="flex justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Cart</h2>
          <AiOutlineClose
            size={24}
            className="cursor-pointer"
            onClick={toggleCartSidebar}
          />
        </div>
        <div className="p-6 space-y-4">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => {
              const product = item.product;
              // Parse the stringified array to get the actual image URLs
              const images = product.images ? JSON.parse(product.images) : [];

              return (
                <div
                  className="flex space-x-4 border-b-2 justify-between"
                  key={item.id}
                >
                  <div>
                    {/* Display product image */}
                    {images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt={product.name}
                        className="w-20 h-20 object-cover"
                      />
                    ) : (
                      <span>No Image Available</span>
                    )}
                  </div>
                  <div>
                    {/* Display product details */}
                    <p>
                      Name:{" "}
                      <span className="font-semibold">{product.name}</span>
                    </p>
                    <p>
                      Quantity:{" "}
                      <span className="font-semibold">{item.quantity}</span>
                    </p>
                    <p>
                      Unit Price:{" "}
                      <span className="font-semibold">Rs.{product.price}</span>
                    </p>
                    <p>
                      Total Price:{" "}
                      <span className="font-semibold">
                        Rs.{item.quantity * product.price}
                      </span>
                    </p>
                  </div>
                  <div className="place-self-center">
                    <button
                      className="text-red-400 underline"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              );
            })
          ) : userId ? (
            <p>Your Cart is empty</p>
          ) : (
            <p>Please login to view cart</p>
          )}
          {cartItems && cartItems.length > 0 && (
            <>
              <p>
                Total Price:{" "}
                <span className="font-semibold">
                  Rs.
                  {cartItems.reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                  )}
                </span>
              </p>
              <button
                className="flex items-center text-lg bg-yellow-500 px-4 py-2 rounded-lg shadow-md mb-4 hover:bg-yellow-400 duration-300"
                onClick={handleCreateOrder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Checkout"
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Overlay */}
      {(isOpen || isCartOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setIsOpen(false);
            setIsCartOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Navbar;
