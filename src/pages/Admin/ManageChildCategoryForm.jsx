"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ManageChildCategoryForm = ({
  onAddChildCategory,
  selectedSubCategory,
}) => {
  const [childCategoryName, setChildCategoryName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (childCategoryName.trim()) {
      onAddChildCategory({ name: childCategoryName });
      setChildCategoryName("");
    }
  };

  return (
    <motion.div
      className="mt-4 border-nitro-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl mb-2 text-white">
        Manage Child Categories for: {selectedSubCategory?.name}
      </h2>
      <form onSubmit={handleSubmit} className="flex">
        <motion.input
          type="text"
          value={childCategoryName}
          onChange={(e) => setChildCategoryName(e.target.value)}
          placeholder="Child Category Name"
          className="border border-nitro-gray-600 bg-nitro-gray-700 text-white p-2 flex-grow mr-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-nitro-accent"
          required
          whileFocus={{ scale: 1.02 }}
        />
        <motion.button
          type="submit"
          className="bg-nitro-accent text-nitro-black p-2 rounded-r-md hover:bg-nitro-gray-200 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Child Category
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ManageChildCategoryForm;
