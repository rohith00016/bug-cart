import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { WishlistContext } from "../context/WishlistContext";

const ProductItem = ({ id, image, name, price }) => {
  const { currency, addToWishlist, removeFromWishlist, wishlistItems } =
    useContext(WishlistContext);

  const isInWishlist = wishlistItems?.[id];

  const handleWishlistClick = (e) => {
    e.preventDefault();
    isInWishlist ? removeFromWishlist(id) : addToWishlist(id);
  };

  return (
    <div className="relative">
      <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
        <div className="overflow-hidden">
          <img
            className="transition ease-in-out hover:scale-110"
            src={`http://localhost:8000/images/${image[0]}.png`} // Replace with your image URL image[0]}
            alt="Product"
          />
        </div>
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <p className="text-sm font-medium">
          {currency}&nbsp;
          {price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </Link>

      {/* Wishlist icon */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-2 right-2 text-red-500 hover:scale-110 transition"
      >
        {isInWishlist ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
      </button>
    </div>
  );
};

export default ProductItem;
