"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Login = () => {
  const { token, login } = useUserAuth();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (token) {
      navigate("/account");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const formErrors = {};
    if (!formData.emailOrPhone)
      formErrors.emailOrPhone = "Email or Phone Number is required";
    if (!formData.password) formErrors.password = "Password is required";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post("/api/users/login", formData);
        if (response.data.message === "Login successful") {
          login(response.data.token);
          toast.success("Login Successful");
          navigate("/account");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        setErrorMessage(errorMessage);
        console.error(error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-nitro-black"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-full max-w-md bg-nitro-gray-800 shadow-md rounded-lg p-8"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Login
        </h2>
        {errorMessage && (
          <motion.p
            className="text-white text-lg mb-4 text-center bg-red-500 p-2 rounded-lg"
          >
            {errorMessage}
          </motion.p>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              className="block text-nitro-gray-300 font-semibold mb-2"
              htmlFor="emailOrPhone"
            >
              Email or Phone Number
            </label>
            <input
              type="text"
              id="emailOrPhone"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-nitro-gray-700 text-white border border-nitro-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-nitro-accent"
              required
            />
            {errors.emailOrPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.emailOrPhone}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-nitro-gray-300 font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-nitro-gray-700 text-white border border-nitro-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-nitro-accent"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <p className="mb-2 text-nitro-gray-300">
            Don't have an account?
            <Link
              to={"/register"}
              className="ml-1 text-nitro-accent hover:underline"
            >
              Sign up
            </Link>
          </p>
          <motion.button
            type="submit"
            className="w-full bg-nitro-accent text-nitro-black py-2 rounded-lg hover:yellow-300 focus:outline-none focus:bg-yellow-300 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;
