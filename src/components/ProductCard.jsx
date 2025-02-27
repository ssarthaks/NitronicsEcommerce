import React from "react";
import { Link } from "react-router-dom";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import Button from "./Button";

const ProductCard = ({
  id,
  name,
  description,
  price,
  imgSrc,
  isLiked,
  onAddToCart,
  onLikeClick,
}) => {
  return (
    <div className="max-w-[22rem] border rounded-2xl shadow-md h-full">
      <Link to={`/products/${id}`}>
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-64 object-cover rounded-t-2xl"
        />
      </Link>
      <div className="mt-4 p-4 pt-0 flex flex-col">
        <p className="text-xl font-semibold line-clamp-2">{name}</p>
        <p className="text-lg">{description.slice(0, 20)}...</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xl font-semibold">Rs. {price}</p>
          <div
            className={`like-icon ${isLiked ? "liked" : ""}`}
            onClick={onLikeClick}
          >
            {isLiked ? <VscHeartFilled size={30} /> : <VscHeart size={30} />}
          </div>
        </div>
        <div className="mt-4">
          <Button text={"Add to Cart"} onClick={onAddToCart} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
