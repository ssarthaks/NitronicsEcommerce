import { motion } from "framer-motion";

const Buttons = ({ text, variant = "primary", onClick }) => {
  const getButtonClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-nitro-accent text-nitro-black hover:bg-yellow-300";
      case "secondary":
        return "bg-nitro-yellow-800 hover:bg-nitro-yellow-700 text-white";
      case "outline":
        return "bg-transparent border-2 border-nitro-accent text-nitro-accent hover:bg-nitro-accent hover:text-nitro-black";
      default:
        return "bg-nitro-accent text-nitro-black hover:bg-nitro-gray-200";
    }
  };

  return (
    <motion.button
      className={`${getButtonClasses()} md:py-2 py-1 px-4 md:px-6 rounded-full font-medium text-base relative overflow-hidden`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <span className="relative z-10">{text}</span>
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ x: "-100%" }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default Buttons;
