import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Buttons from "./Buttons";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        const featuredProducts = response.data
          .filter((product) => product.isFeatured)
          .map((product) => ({
            ...product,
            images: JSON.parse(product.images), // Fix applied here
          }));
        setProducts(featuredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchProducts();
  }, []);

  const handleShopClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="py-20 bg-nitro-black">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4 text-white">
            Featured Products
          </h2>
          <div className="w-24 h-1 bg-nitro-accent mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="bg-nitro-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-[200px] w-full object-cover rounded-t-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p>No Image Available</p>
                  </div>
                )}
              </div>
              <div className="px-6 pb-6 space-y-1 mt-4 md:space-y-3">
                <h3 className="lg:text-lg md:text-base text-sm  font-bold text-white">{product.name}</h3>
                <p className="text-nitro-gray-300 pb-2 md:pb-2">Rs. {product.price}</p>
                <Buttons
                  onClick={() => handleShopClick(product.id)}
                  text="Shop Now"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
