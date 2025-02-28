import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { BiRightArrowAlt } from "react-icons/bi";
import { Link } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        const fetchedProduct = response.data;

        fetchedProduct.images = JSON.parse(fetchedProduct.images);

        setProduct(fetchedProduct);
        setMainImage(fetchedProduct.images[0]);
        setActiveImage(fetchedProduct.images[0]);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  if (!product) {
    return <p className="text-nitro-gray-300">Product not found!</p>;
  }

  return (
    <div className="mx-auto py-12 min-h-[80vh] bg-nitro-black">
      <Link to="/products">
        <div className="container mx-auto">
          <motion.button
            type="submit"
            className="bg-nitro-accent text-nitro-black px-4 py-2 rounded-full font-medium flex items-center justify-center gap-2 transition-colors mb-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span>View all products</span>
            <BiRightArrowAlt className="text-3xl " />
          </motion.button>
        </div>
      </Link>
      <div className="flex flex-col md:flex-row justify-center items-center self-center container mx-auto">
        <motion.div
          className="flex flex-col-reverse md:flex-row md:space-x-4 gap-2 basis-2/4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-nowrap md:flex-col space-x-2 md:space-x-0 justify-start gap-3">
            {product.images.map((image, index) => (
              <motion.img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 cursor-pointer object-cover mb-2 md:mb-0 ${
                  image === activeImage ? "border-2 border-nitro-accent" : ""
                }`}
                onClick={() => {
                  setMainImage(image);
                  setActiveImage(image);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>
          <motion.div
            className="w-full h-[400px] md:h-[400px] relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-fill"
            />
          </motion.div>
        </motion.div>
        <motion.div
          className="md:ml-8 mt-4 md:mt-0 basis-2/4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold mb-4 text-white">{product.name}</h1>
          <p className="font-light text-lg text-nitro-gray-300">
            Category: {product.category}
          </p>
          {product.subCategory && (
            <p className="font-light text-lg mb-4 text-nitro-gray-300">
              Subcategory: {product.subCategory}
            </p>
          )}
          <p className="text-base mb-4 text-nitro-gray-300">
            {product.description}
          </p>
          <p className="text-lg font-bold mb-4 text-nitro-accent">
            Price: Nrs. {product.price}
          </p>

          <div className="flex items-center mb-4 border border-nitro-gray-700 rounded-md overflow-hidden justify-between w-fit">
            <button
              onClick={decrementQuantity}
              className="bg-nitro-gray-800 px-3 py-2 text-lg hover:bg-nitro-gray-700 focus:outline-none text-white"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              readOnly
              className="w-16 text-center border-none focus:outline-none bg-nitro-gray-900 text-white"
            />
            <button
              onClick={incrementQuantity}
              className="bg-nitro-gray-800 px-3 py-2 text-lg hover:bg-nitro-gray-700 focus:outline-none text-white"
            >
              +
            </button>
          </div>

          <Button text="Add to Cart" onClick={handleAddToCart} />
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
