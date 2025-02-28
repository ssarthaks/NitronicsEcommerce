import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { userId } = location.state;

    try {
      await axios.post("/api/users/verify-otp", { userId, otp });
      toast.success("User Registered Successfully!");
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-nitro-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-md bg-nitro-gray-800 shadow-md rounded-lg p-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Verify OTP
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-nitro-gray-300 font-semibold mb-2"
              htmlFor="otp"
            >
              Enter OTP
            </label>
            <motion.input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              className="w-full px-3 py-2 bg-nitro-gray-700 text-white border border-nitro-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-nitro-accent"
              required
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-nitro-accent text-nitro-black py-2 rounded-lg hover:bg-nitro-gray-200 focus:outline-none focus:bg-nitro-gray-200 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Verify OTP
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default OtpVerification;
