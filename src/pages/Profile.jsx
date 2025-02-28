import { useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import UserDetails from "./User/UserDetails";
import UserCart from "./User/UserCart";
import UserOrder from "./User/UserOrder";
import { RxHamburgerMenu } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const { token, user, logout, fetchUserData } = useUserAuth();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("userActiveTab") || "account"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("userActiveTab", tab);
    setIsSidebarOpen(false);
  };

  const refetchUserData = async () => {
    if (user) {
      await fetchUserData(user.id);
      console.log("User data refetched");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!token) {
    navigate("/login");
    return null;
  }

  const sidebarContent = (
    <motion.div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-white">Dashboard</h2>
      <ul className="space-y-4">
        {["account", "cart", "orders", "favourites"].map((tab) => (
          <motion.li key={tab}>
            <motion.button
              onClick={() => handleTabChange(tab)}
              className={`w-full text-left p-2 rounded ${
                activeTab === tab
                  ? "bg-nitro-gray-700"
                  : "hover:bg-nitro-gray-700"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          </motion.li>
        ))}
        <motion.li>
          <motion.button
            onClick={logout}
            className="text-left bg-nitro-accent text-nitro-black p-2 px-8 rounded-full w-fit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </motion.li>
      </ul>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen items-start bg-nitro-black text-white">
      {/* Sidebar for larger screens */}
      <motion.div
        className="hidden md:flex md:w-64 bg-nitro-gray-800 p-4 min-h-screen"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {sidebarContent}
      </motion.div>

      <motion.button
        onClick={toggleSidebar}
        className="md:hidden block p-4 text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <RxHamburgerMenu size={24} />
      </motion.button>

      {/* Sidebar for mobile view */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="md:hidden fixed top-0 left-0 z-50 w-64 h-full bg-nitro-gray-800 p-4"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Main content area */}
      <motion.div
        className="flex-1 p-4 mr-8 md:mr-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "account" && user && (
              <UserDetails userData={user} refetchUserData={refetchUserData} />
            )}
            {activeTab === "cart" && <UserCart userId={user?.id} />}
            {activeTab === "orders" && <UserOrder userId={user?.id} />}
            {activeTab === "favourites" && (
              <div>
                <h1 className="text-3xl font-bold md:mb-8">Your Favourites</h1>
                Your Favourite Items will appear here. <br />
                <br />
                !!! No Backend Here !!!
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {!user && activeTab === "account" && (
          <p className="text-center text-nitro-gray-300">
            Loading user data...
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
