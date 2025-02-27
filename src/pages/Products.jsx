"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import ProductCard from "../components/ProductCard";
import { AiOutlineClose, AiOutlineFilter } from "react-icons/ai"
import { useLocation } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useCategory } from "../context/CategoryContext"

const Products = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const category = searchParams.get("category")
  const subcategory = searchParams.get("subcategory")
  const childcategory = searchParams.get("childcategory")

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedPriceRange, setSelectedPriceRange] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [productList, setProductList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCart()
  const { categories } = useCategory()

  // Reference for sidebar to detect clicks outside
  const filterRef = useRef(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products")
        const productsWithLikeStatus = response.data.map((product) => ({
          ...product,
          images: JSON.parse(product.images),
          isLiked: false,
        }))
        setProductList(productsWithLikeStatus)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = async (productId) => {
    await addToCart(productId)
  }

  const handleLikeClick = (productId) => {
    setProductList((prevList) =>
      prevList.map((product) => (product.id === productId ? { ...product, isLiked: !product.isLiked } : product)),
    )
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handlePriceFilterChange = (range) => {
    setSelectedPriceRange(range)
  }

  const handleCategoryFilterChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const filteredProducts = productList.filter((product) => {
    let matchesPrice = true
    let matchesCategory = true

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange
      matchesPrice = product.price >= min && product.price <= max
    }
    if (category && product.category) {
      const formattedCategory = category.replace(/-/g, " ").toLowerCase().trim()
      if (product.category.toLowerCase().trim() !== formattedCategory) {
        return false
      }
    }
    if (subcategory && product.subCategory) {
      const formattedSubcategory = subcategory.replace(/-/g, " ").toLowerCase().trim()
      if (product.subCategory.toLowerCase().trim() !== formattedSubcategory) {
        return false
      }
    } else if (subcategory) {
      return false
    }
    if (childcategory && product.childCategory) {
      const formattedChildCategory = childcategory.replace(/-/g, " ").toLowerCase().trim()
      if (product.childCategory.toLowerCase().trim() !== formattedChildCategory) {
        return false
      }
    } else if (childcategory) {
      return false
    }

    if (selectedCategories.length > 0) {
      matchesCategory =
        selectedCategories.includes(product.category) || selectedCategories.includes(product.childCategory)
    }

    return matchesPrice && matchesCategory
  })

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterOpen])

  if (loading) return <p className="text-nitro-gray-300">Loading...</p>
  if (error) return <p className="text-nitro-gray-300">Error loading data: {error.message}</p>

  return (
    <div className="mx-auto py-12 min-h-[80vh] relative flex flex-col bg-nitro-black">
      <div className="container mx-auto">
        <motion.h1
          className="text-3xl font-bold mb-4 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Products
        </motion.h1>
        <motion.p
          className="mb-4 text-nitro-gray-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Browse through our wide variety of tech products.
        </motion.p>
        {/* Filter Button */}
        <motion.button
          onClick={toggleFilter}
          className="flex items-center text-lg bg-nitro-gray-800 text-white px-4 py-2 rounded-lg shadow-md mb-4 hover:bg-nitro-gray-700 duration-300 max-w-fit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AiOutlineFilter size={24} className="mr-2" /> Filter by
        </motion.button>
        {/* Filter Sidebar */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              ref={filterRef}
              className="fixed top-0 left-0 h-full bg-nitro-gray-900 shadow-lg w-64 z-50"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center p-4 border-b border-nitro-gray-700">
                <h2 className="text-xl font-bold text-white">Filter</h2>
                <button onClick={toggleFilter}>
                  <AiOutlineClose size={24} className="text-white" />
                </button>
              </div>
              {/* Price Range Filter */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">Price Range</h3>
                <select
                  onChange={(e) => handlePriceFilterChange(JSON.parse(e.target.value))}
                  className="w-full p-2 border rounded bg-nitro-gray-800 text-white border-nitro-gray-700"
                >
                  <option value="[0,10000000]">All</option>
                  <option value="[0, 5000]">Up to Rs.5000</option>
                  <option value="[5000, 10000]">Rs. 5000 - Rs. 10000</option>
                  <option value="[10000, 20000]">Rs. 10000- Rs. 20000</option>
                  <option value="[20000, 50000]">Rs. 20000 - Rs. 50000</option>
                  <option value="[50000, 100000]">Above Rs. 50000</option>
                </select>
              </div>
              {/* Category Filter */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">Categories</h3>
                {categories.map((category) => (
                  <label key={category.id} className="block text-nitro-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryFilterChange(category.name)}
                      className="mr-2"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Overlay */}
        {isFilterOpen && (
          <motion.div
            className="fixed inset-0 bg-black opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFilterOpen(false)}
          ></motion.div>
        )}
        {/* Product List */}
        <motion.div
          className="flex flex-wrap gap-4 mx-auto text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <motion.div
                key={index}
                className=""
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    description={
                      product.description.split(" ").slice(0, 5).join(" ") +
                      (product.description.split(" ").length > 5 ? "..." : "")
                    }
                    price={product.price}
                    imgSrc={product.images[0]}
                    isLiked={product.isLiked}
                    onAddToCart={() => handleAddToCart(product.id)}
                    onLikeClick={() => handleLikeClick(product.id)}
                  />
              </motion.div>
            ))
          ) : (
            <p className="mx-4 text-nitro-gray-300">No products found matching your filters.</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Products

