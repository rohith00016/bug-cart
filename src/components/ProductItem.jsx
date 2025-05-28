import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { WishlistContext } from "../context/WishlistContext";

const ProductItem = ({ id, image, name, price }) => {
  const { currency, addToWishlist, removeFromWishlist, wishlistItems } =
    useContext(WishlistContext);

  const isInWishlist = wishlistItems?.[id] || false;

  const handleWishlistClick = (e) => {
    e.preventDefault();

    if (isInWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  return (
    <div className="relative">
      <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
        <div className="overflow-hidden">
          <img
            className="transition ease-in-out hover:scale-110"
            src={
              image &&
              image[0] &&
              `${import.meta.env.VITE_IMAGE_BASE_URL}/images/${image[0]}.png`
            }
            alt={name || "Product"}
          />
        </div>
        <p className="pt-3 pb-1 text-sm">{name || "Unknown Product"}</p>
        <p className="text-sm font-medium">
          {currency}
          {(price || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </Link>

      <button
        onClick={handleWishlistClick}
        className="absolute top-2 right-2 text-red-500 hover:scale-110 transition"
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isInWishlist ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
      </button>
    </div>
  );
};

export default ProductItem;
