import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarthak Sharma",
    role: "Tech Enthusiast",
    content:
      "Nitronics has completely transformed my tech experience. Their products are not only high-quality but also reasonably priced. The customer service is exceptional!",
    rating: 5,
  },
  {
    id: 2,
    name: "Rahul Dev Banjara",
    role: "AI Engineer",
    content:
      "As someone who relies heavily on technology for work, I can confidently say that Nitronics offers the best products in the market. Fast shipping and great after-sales support.",
    rating: 3,
  },
  {
    id: 3,
    name: "Srijan Maharjan",
    role: "Software Developer",
    content:
      "I've been a loyal customer for years. Nitronics consistently delivers cutting-edge technology that helps me stay ahead in my creative work. Highly recommended!",
    rating: 4,
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setCurrent((current + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((current - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="bg-gradient-to-r from-nitro-black to-nitro-gray-900 py-20 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
          <div className="w-24 h-1 bg-nitro-accent mx-auto"></div>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}

              className="bg-nitro-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl text-center"
            >
              <div className="flex justify-center mb-6">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"
                  className="w-20 h-20 rounded-full border-4 border-nitro-accent"
                />
              </div>
              <div className="flex flex-col gap-2 justify-center mb-6">
                
              <div>
                <h3 className="text-xl font-bold text-white">
                  {testimonials[current].name}
                </h3>
                <p className="text-nitro-accent">{testimonials[current].role}</p>
              </div>
              <div className="flex mx-auto gap-1">
                {[...Array(testimonials[current].rating)].map((_, i) =>(
                    <Star
                      key={i}
                      className="w-5 h-5 fill-nitro-accent text-nitro-accent"
                    />
                  ))}
              </div>
              </div>
              <p className="text-lg md:text-xl italic text-nitro-gray-200">
                "{testimonials[current].content}"
              </p>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-10 bg-nitro-gray-800/50 backdrop-blur-sm p-3 rounded-full hover:bg-nitro-gray-700/50 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-10 bg-nitro-gray-800/50 backdrop-blur-sm p-3 rounded-full hover:bg-nitro-gray-700/50 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > current ? 1 : -1);
                setCurrent(index);
              }}
              className={`w-3 h-3 mx-1 rounded-full ${
                index === current ? "bg-nitro-accent" : "bg-nitro-gray-600"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
