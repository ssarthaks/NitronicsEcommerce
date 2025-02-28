import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const { token, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/admin");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/admin/login", {
        username,
        password,
      });
      if (response.data.token) {
        login(response.data.token);
        navigate("/admin");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-nitro-black"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-nitro-gray-800 p-6 rounded-lg shadow-md w-96"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-white">
          Admin Login
        </h2>
        {error && (
          <motion.p
            className="text-red-500 text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
        <form onSubmit={handleSubmit}>
          <motion.input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border border-nitro-gray-600 bg-nitro-gray-700 text-white p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-nitro-accent"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-nitro-gray-600 bg-nitro-gray-700 text-white p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-nitro-accent"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button
            type="submit"
            className="bg-nitro-accent text-nitro-black p-2 rounded w-full hover:bg-nitro-gray-200 transition duration-300"
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

export default AdminLogin;
