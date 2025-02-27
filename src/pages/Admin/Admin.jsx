"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";
import SubCategoryForm from "./SubcategoryForm";
import ProductUpload from "./ProductUpload";
import ManageChildCategoryForm from "./ManageChildCategoryForm";
import AdminOrders from "./AdminOrders";
import { useCategory } from "../../context/CategoryContext";
import Button from "../../components/Button";

const Admin = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    handleAddCategory,
    handleAddSubCategory,
    handleAddChildCategory,
    handleRemoveCategory,
    handleRemoveSubCategory,
    handleRemoveChildCategory,
  } = useCategory();
  const [activeTab, setActiveTab] = useState("categories");

  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const sidebarItems = [
    { id: "categories", label: "Categories" },
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
  ];

  return (
    <div className="flex bg-nitro-black text-white min-h-screen">
      {/* Sidebar */}
      <motion.div className="w-64 bg-nitro-gray-800 min-h-screen p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul>
          {sidebarItems.map((item) => (
            <motion.li key={item.id} className="mb-4">
              <motion.button
                className={`w-full text-left p-2 rounded ${
                  activeTab === item.id
                    ? "bg-nitro-gray-700"
                    : "hover:bg-nitro-gray-700"
                }`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id !== "categories") setSelectedCategory(null);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            </motion.li>
          ))}
          <Button text="Hello" />
        </ul>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-1 p-6 bg-nitro-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

        <AnimatePresence mode="wait">
          {activeTab === "categories" && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryForm onAddCategory={handleAddCategory} />

              <div className="mt-4">
                <h2 className="text-xl font-bold mb-2">Categories</h2>
                <table className="min-w-full bg-nitro-gray-800 border border-nitro-gray-700">
                  <thead>
                    <tr>
                      <th className="border-b border-nitro-gray-700 p-2 text-start">
                        Name
                      </th>
                      <th className="border-b border-nitro-gray-700 p-2 text-start">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="border-b border-nitro-gray-700 p-2">
                          {category.name}
                        </td>
                        <td className="border-b border-nitro-gray-700 p-2">
                          <div className="flex space-x-2">
                            <motion.button
                              onClick={() => {
                                setSelectedCategory(category);
                                setSelectedSubCategory(null);
                              }}
                              className="bg-nitro-accent text-nitro-black p-2 rounded-md hover:bg-nitro-gray-200 transition"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Manage Subcategories
                            </motion.button>
                            <motion.button
                              onClick={() => handleRemoveCategory(category.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Delete
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedCategory && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl mb-4">
                    Manage Subcategories for: {selectedCategory.name}
                  </h2>
                  <SubCategoryForm
                    onAddSubCategory={handleAddSubCategory}
                    categoryId={selectedCategory.id}
                  />
                  <CategoryList
                    categories={selectedCategory.subCategories}
                    onRemoveCategory={handleRemoveSubCategory}
                    onSelectSubCategory={(subCategory) =>
                      setSelectedSubCategory(subCategory)
                    }
                  />
                  {selectedSubCategory && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ManageChildCategoryForm
                        onAddChildCategory={handleAddChildCategory}
                        selectedSubCategory={selectedSubCategory}
                      />

                      <div className="mt-4">
                        <h3 className="text-lg mb-2 text-yellow-500">
                          Child Categories for: {selectedSubCategory.name}
                        </h3>
                        {selectedSubCategory.childCategories &&
                        selectedSubCategory.childCategories.length > 0 ? (
                          <ul>
                            {selectedSubCategory.childCategories.map(
                              (child) => (
                                <motion.li
                                  key={child.id}
                                  className="flex justify-between items-center border-b border-nitro-gray-700 p-2"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <span>{child.name}</span>
                                  <motion.button
                                    onClick={() =>
                                      handleRemoveChildCategory(child.id)
                                    }
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Delete
                                  </motion.button>
                                </motion.li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p>No child categories available.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl mb-4">Upload Product</h2>
              <ProductUpload />
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AdminOrders />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Admin;
