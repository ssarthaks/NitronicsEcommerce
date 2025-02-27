"use client"
import { motion } from "framer-motion"

const CategoryList = ({ categories, onRemoveCategory, onSelectSubCategory }) => {
  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <motion.li
          key={category.id}
          className="flex justify-between items-center p-2 border border-nitro-gray-600 rounded-md bg-nitro-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-white">{category.name}</span>
          <div className="flex space-x-2">
            <motion.button
              onClick={() => onSelectSubCategory(category)}
              className="bg-nitro-accent text-nitro-black p-2 rounded-md hover:bg-nitro-gray-200 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Manage Child Category
            </motion.button>
            <motion.button
              onClick={() => onRemoveCategory(category.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Remove
            </motion.button>
          </div>
        </motion.li>
      ))}
    </ul>
  )
}

export default CategoryList

