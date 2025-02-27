"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="bg-nitro-gray-900 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-white">
            Stay Updated with Nitronics
          </h2>
          <p className="text-nitro-gray-300 mb-8">
            Subscribe to our newsletter for the latest product updates,
            exclusive offers, and tech news.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          >
            <motion.div
              className="flex-grow relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-6 py-4 rounded-full border border-nitro-gray-700 bg-nitro-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-nitro-accent focus:border-transparent"
                required
              />
            </motion.div>
            <motion.button
              type="submit"
              className="bg-nitro-accent text-nitro-black px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-nitro-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span>Subscribe</span>
              <Send className="w-4 h-4" />
            </motion.button>
          </form>

          <AnimatedCheckmark isVisible={isSubmitted} />
        </motion.div>
      </div>
    </div>
  );
};

const AnimatedCheckmark = ({ isVisible }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        height: isVisible ? "auto" : 0,
      }}
      className="mt-4 text-nitro-accent font-medium"
    >
      Thanks for subscribing! We'll be in touch soon.
    </motion.div>
  );
};

export default Newsletter;
