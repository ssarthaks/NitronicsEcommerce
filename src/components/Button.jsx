import React from "react";

const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="ease-linear border-2 border-yellow-200 text-yellow-700  px-4 py-2 rounded-full hover:bg-yellow-200 transition-colors duration-300 font-medium w-fit"
    >
      {text}
    </button>
  );
};

export default Button;
