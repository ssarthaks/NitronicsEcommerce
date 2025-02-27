import { motion } from "framer-motion";

const CustomPagination = ({ totalSlides, currentSlide, onPageChange }) => {
  return (
    <div className="flex space-x-3">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className="relative h-3 w-12 rounded-full overflow-hidden bg-white/30 backdrop-blur-sm"
          aria-label={`Go to slide ${index + 1}`}
        >
          {currentSlide === index && (
            <motion.div
              className="absolute inset-0 bg-white"
              layoutId="paginationIndicator"
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default CustomPagination;
