import img from "../../assets/SaveEnergy.png";
import img2 from "../../assets/Warranty.png";
import img3 from "../../assets/supportservice.png";
import img4 from "../../assets/EcoFriendly.png";

import { motion } from "framer-motion"

const images = [
  {
    src: img,
    title: "Energy Efficient",
    text: "Save energy with our eco-friendly electronics.",
  },
  {
    src: img2,
    title: "Warranty",
    text: "Enjoy long-term peace of mind with a solid warranty.",
  },
  {
    src: img3,
    title: "24/7 Tech Support",
    text: "Get help whenever you need it with our round-the-clock support.",
  },
  {
    src: img4,
    title: "Eco-Friendly",
    text: "Our products are designed with sustainability in mind.",
  },
]

const Banner2 = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="py-20 bg-nitro-gray-900">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl font-bold mb-4 text-white">
            Why Choose <span className="text-nitro-accent">Nitronics</span>?
          </h2>
          <div className="w-24 h-1 bg-nitro-accent mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {images.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-nitro-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="w-20 h-20 flex items-center justify-center bg-nitro-gray-700 rounded-full mb-6"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={item.src || "/placeholder.svg?height=80&width=80"}
                  alt={`${item.title} icon`}
                  className="h-12 w-12 object-contain"
                />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
              <p className="text-nitro-gray-300">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Banner2

