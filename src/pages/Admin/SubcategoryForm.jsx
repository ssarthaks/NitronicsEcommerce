"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const SubCategoryForm = ({ categoryId, onAddSubCategory }) => {
  const [name, setName] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddSubCategory({ categoryId, name })
    setName("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex mb-4">
      <motion.input
        type="text"
        placeholder="Subcategory Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border border-nitro-gray-600 bg-nitro-gray-700 text-white p-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-nitro-accent flex-1"

      />
      <motion.button
        type="submit"
        className="bg-nitro-accent text-nitro-black p-2 rounded-r-md hover:bg-yellow-300 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Add Subcategory
      </motion.button>
    </form>
  )
}

export default SubCategoryForm

