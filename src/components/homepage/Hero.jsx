import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Buttons from "./Buttons";
import hero1 from "../../assets/a.png";
import hero2 from "../../assets/b.png";
import hero3 from "../../assets/c.png";
import { Link } from "react-router-dom";
import CustomPagination from "../CustomPagination";

const slides = [
  {
    id: 1,
    background: "bg-gradient-to-r from-nitro-black to-nitro-gray-800",
    image: hero1,
    heading: "Discover Cutting-Edge Technology",
    text: "Explore the latest in electronics with Nitronics Store. Our top-quality gadgets and devices bring innovation to your doorstep.",
  },
  {
    id: 2,
    background: "bg-gradient-to-r from-nitro-gray-900 to-nitro-gray-800",
    image: hero2,
    heading: "Experience Ultimate Performance",
    text: "Unlock new possibilities with our premium electronics collection. From smart devices to high-tech gadgets, we have everything you need.",
  },
  {
    id: 3,
    background: "bg-gradient-to-r from-nitro-black to-nitro-gray-900",
    image: hero3,
    heading: "Upgrade Your Tech Game",
    text: "Step into the future with our advanced technology products. Enhance your lifestyle with devices that combine performance and style.",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="relative overflow-hidden bg-nitro-black">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      <Swiper
        loop={true}
        effect={"fade"}
        pagination={{ enabled: false }}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        modules={[Autoplay, Pagination, EffectFade]}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        className="relative"
      >
        {slides.map((slide) => (
          <SwiperSlide
            key={slide.id}
            className={`${slide.background} flex items-center`}
          >
            <div className="container mx-auto flex flex-col md:flex-row items-center min-h-[90vh] md:justify-between justify-center px-6 relative z-10">
              {/* Text Section */}
              <motion.div
                className="text-center md:text-left basis-full md:basis-1/2 mb-8 md:mb-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100px" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-1 bg-nitro-accent mb-6 hidden md:block"
                />
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  {slide.heading}
                </motion.h1>
                <motion.p
                  className="text-base md:text-lg mb-8 text-nitro-gray-300 max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  {slide.text}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.7 }}
                >
                  <Link to="/products">
                    <Buttons text="Shop Now" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Image Section */}
              <motion.div
                className="w-full md:flex hidden justify-end basis-full md:basis-1/2 h-full"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="relative w-full h-[500px] md:h-[600px]">
                  <img
                    src={slide.image}
                    alt="Hero Image"
                    className="absolute inset-0 object-cover w-full h-full rounded-lg"
                  />
                </div>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <CustomPagination
          totalSlides={slides.length}
          currentSlide={currentSlide}
          onPageChange={(index) =>
            document.querySelector(".swiper").swiper.slideTo(index)
          }
        />
      </div>
    </div>
  );
};

export default Hero;
