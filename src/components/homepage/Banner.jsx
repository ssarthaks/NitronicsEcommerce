import { motion } from "framer-motion";
import img from "../../assets/a.png";
import img2 from "../../assets/b.png";
import { Link } from "react-router-dom";

const Banner = () => {
  const bannerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: custom * 0.1,
      },
    }),
  };

  return (
    <div className="bg-nitro-black">
      <motion.div
        className="mx-auto px-4 py-16  text-white font-medium"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={bannerVariants}
      >
        <div className="container mx-auto flex flex-wrap justify-between gap-6">
          <motion.div
            className="flex-1 min-w-[300px] max-w-[650px] relative group overflow-hidden rounded-2xl"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="overflow-hidden h-[450px]">
              <motion.img
                src={img}
                alt="Laptop Sale"
                className="w-full h-full object-cover rounded-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-nitro-black/90 via-nitro-black/60 to-transparent bg-black bg-opacity-50">
              <motion.h2
                className="text-3xl text-white font-bold mb-3"
                variants={contentVariants}
                custom={1}
              >
                Big Sale on Laptops
              </motion.h2>
              <motion.p
                className="text-nitro-gray-300 text-lg mb-3 max-w-md"
                variants={contentVariants}
                custom={2}
              >
                Grab your favorite laptops at unbeatable prices. Limited time
                only!
              </motion.p>
              <Link to="/products">
                <motion.button
                  className="text-purple-700 bg-purple-200 px-4 py-2 rounded-full hover:bg-nitro-gray-200 transition-colors duration-300 font-medium w-fit"
                  variants={contentVariants}
                  custom={3}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop Now
                </motion.button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="flex-1 min-w-[300px] max-w-[650px] relative group overflow-hidden rounded-2xl"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="overflow-hidden h-[450px]">
              <motion.img
                src={img2}
                alt="New Tech Gadgets"
                className="w-full h-full object-cover rounded-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-nitro-black/90 via-nitro-black/60 to-transparent bg-black bg-opacity-50">
              <motion.h2
                className="text-3xl text-white font-bold mb-3"
                variants={contentVariants}
                custom={1}
              >
                Latest Tech Gadgets
              </motion.h2>
              <motion.p
                className="text-nitro-gray-300 text-lg mb-3 max-w-md"
                variants={contentVariants}
                custom={2}
              >
                Check out the newest gadgets in tech. Innovation at your
                fingertips.
              </motion.p>
              <Link to="/products">
                <motion.button
                  className="text-purple-700 bg-purple-200 px-4 py-2 rounded-full hover:bg-nitro-gray-200 transition-colors duration-300 font-medium w-fit"
                  variants={contentVariants}
                  custom={3}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Now
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Banner;
