"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"

const ProductUpload = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedChildCategory, setSelectedChildCategory] = useState('');
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    images: []
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [seed, setSeed] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get('/api/category');
        setCategories(categoriesResponse.data);
        
        const productsResponse = await axios.get('/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token,seed]);

  const handleInputChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setProductData({
      ...productData,
      images: [...e.target.files]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('category', selectedCategory);
    if (selectedSubCategory) formData.append('subCategory', selectedSubCategory);
    if (selectedChildCategory) formData.append('childCategory', selectedChildCategory);

    productData.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post('/api/products/', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Product uploaded')
      setProducts([...products, response.data]);
      setModalOpen(false);
      setProductData({ name: '', description: '', price: '', images: [] });
      setSelectedCategory('');
      setSelectedSubCategory('');
      setSelectedChildCategory('');
      setSeed(Math.random())

    } catch (error) {
      toast.error('Error uploading product')
    }
  };

  const toggleFeature = async (id) => {
    try {
      const response = await axios.put(`/api/products/${id}/feature`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedProduct = response.data.message;
      setProducts(products.map(product => 
        product.id === id ? { ...product, isFeatured: response.data.isFeatured } : product
      ));
      setSeed(Math.random())
      if (updatedProduct === "Product featured successfully!") {
        toast.success('Product is now featured');
      } else {
        toast.info('Product is no longer featured',{icon: "☹️"});
      }
    } catch (error) {
      toast.error('Error featuring product')
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(products.filter(product => product.id !== id));
      toast.success('Product deleted successfully')
      setSeed(Math.random())

    } catch (error) {
      toast.error('Error deleting product')
    }
  };

  return (
    <div className="p-6 bg-nitro-gray-800 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-white">Product Management</h1>
      <motion.button
        onClick={() => setModalOpen(true)}
        className="bg-nitro-accent text-nitro-black font-semibold py-2 px-4 rounded-md hover:bg-nitro-gray-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Upload New Product
      </motion.button>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="modal-overlay absolute inset-0 bg-black opacity-50"></div>
            <motion.div
              className="modal-container bg-nitro-gray-800 w-11/12 md:w-1/3 rounded shadow-lg z-50 overflow-y-auto"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="modal-header flex justify-between items-center p-4 border-b border-nitro-gray-700">
                <h2 className="text-lg font-bold text-white">Upload New Product</h2>
                <button onClick={() => setModalOpen(false)} className="text-nitro-gray-300 text-4xl">
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Product Name */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-nitro-gray-300">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-nitro-gray-600 rounded-md p-2 bg-nitro-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-nitro-accent"
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-nitro-gray-300">Description</label>
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-nitro-gray-600 rounded-md p-2 bg-nitro-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-nitro-accent"
                  ></textarea>
                </div>

                {/* Price */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-nitro-gray-300">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-nitro-gray-600 rounded-md p-2 bg-nitro-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-nitro-accent"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-nitro-gray-300">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                    className="mt-1 block w-full border border-nitro-gray-600 rounded-md p-2 bg-nitro-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-nitro-accent"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SubCategory Dropdown */}
                {selectedCategory && (
                  <div className="form-group">
                    <label className="block text-sm font-medium text-nitro-gray-300">SubCategory</label>
                    <select
                      value={selectedSubCategory}
                      onChange={(e) => setSelectedSubCategory(e.target.value)}
                      className="mt-1 block w-full border border-nitro-gray-600 rounded-md p-2 bg-nitro-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-nitro-accent"
                    >
                      <option value="">Select SubCategory (Optional)</option>
                      {categories
                        .find((cat) => cat.name === selectedCategory)
                        ?.subCategories.map((sub) => (
                          <option key={sub.id} value={sub.name}>
                            {sub.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* ChildCategory Dropdown */}
                {selectedSubCategory && (
                  <div className="form-group">
                    <label className="block text-sm font-medium text-nitro-gray-300">Child Category</label>
                    <select
                      value={selectedChildCategory}
                      onChange={(e) => setSelectedChildCategory(e.target.value)}
                      className="mt-1 block w-full border border-nitro-gray-600 rounded-md p-2 bg-nitro-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-nitro-accent"
                    >
                      <option value="">Select Child Category (Optional)</option>
                      {categories
                        .find((cat) => cat.name === selectedCategory)
                        ?.subCategories.find((sub) => sub.name === selectedSubCategory)
                        ?.childCategories.map((child) => (
                          <option key={child.id} value={child.name}>
                            {child.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* File Input for Images */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-nitro-gray-300">Images</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    required
                    className="mt-1 block w-full border border-nitro-gray-600 rounded-md p-2 bg-nitro-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-nitro-accent"
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-nitro-accent text-nitro-black font-semibold py-2 rounded-md hover:bg-nitro-gray-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Upload Product
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Table */}
      <h2 className="text-xl font-semibold mt-6 text-white">Uploaded Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full mt-4 bg-nitro-gray-700">
          <thead>
            <tr>
              <th className="border-b border-nitro-gray-600 text-start p-2 text-nitro-gray-300">Name</th>
              <th className="border-b border-nitro-gray-600 text-start p-2 text-nitro-gray-300">Description</th>
              <th className="border-b border-nitro-gray-600 text-start p-2 text-nitro-gray-300">Category</th>
              <th className="border-b border-nitro-gray-600 text-start p-2 text-nitro-gray-300">Sub Category</th>
              <th className="border-b border-nitro-gray-600 text-start p-2 text-nitro-gray-300">Child Category</th>
              <th className="border-b border-nitro-gray-600 text-start p-2 text-nitro-gray-300">Price</th>
              <th className="border-b border-nitro-gray-600 text-start p-2 text-nitro-gray-300">Featured</th>
              <th className="border-b border-nitro-gray-600 text-start p-2 text-nitro-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border-b border-nitro-gray-600 p-2 text-white">{product.name}</td>
                <td className="border-b border-nitro-gray-600 p-2 text-white">{product.description}</td>
                <td className="border-b border-nitro-gray-600 p-2 text-white">{product.category}</td>
                <td className="border-b border-nitro-gray-600 p-2 text-white">{product.subCategory}</td>
                <td className="border-b border-nitro-gray-600 p-2 text-white">{product.childCategory}</td>
                <td className="border-b border-nitro-gray-600 p-2 text-white">{product.price}</td>
                <td className="border-b border-nitro-gray-600 p-2">
                  <motion.button
                    onClick={() => toggleFeature(product.id)}
                    className={`px-3 py-1 rounded-md ${product.isFeatured ? "bg-green-500" : "bg-nitro-gray-500"} text-white`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {product.isFeatured ? "Unfeature" : "Feature"}
                  </motion.button>
                </td>
                <td className="border-b border-nitro-gray-600 p-2">
                  <motion.button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductUpload

