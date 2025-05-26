import { useContext, useEffect } from "react";
import { WishlistContext } from "../context/WishlistContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const Wishlist = () => {
  const {
    wishlistData,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    currency,
    fetchWishlist,
    isLoading,
    error,
  } = useContext(WishlistContext);

  useEffect(() => {
    fetchWishlist(); // Fetch wishlist from backend on component mount
  }, [fetchWishlist]);

  const toggleWishlist = (itemId) => {
    if (wishlistItems[itemId]) {
      removeFromWishlist(itemId);
    } else {
      addToWishlist(itemId);
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading wishlist...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // Safeguard for undefined wishlistData
  if (!wishlistData) {
    return <p className="text-center text-gray-500">Your wishlist is empty.</p>;
  }

  return (
    <div className="border-t pt-14 px-4">
      <div className="mb-6 text-2xl font-semibold">
        <Title text1="YOUR" text2="WISHLIST" />
      </div>
      {wishlistData.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid gap-6">
          {wishlistData.map((item) => (
            <div
              key={item.productId._id}
              className="flex items-center gap-4 border-b pb-4"
            >
              <img
                className="w-24 h-24 object-cover"
                src={item.productId.image && item.productId.image[0]}
                alt={item.productId.name || "Product"}
              />
              <div className="flex-1">
                <h3 className="font-medium">
                  {item.productId.name || "Unknown Product"}
                </h3>
                <p className="text-sm text-gray-500">
                  {currency}&nbsp;
                  {(item.productId.price || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <img
                src={assets.bin_icon}
                alt="Remove"
                className="w-5 h-5 cursor-pointer"
                onClick={() => toggleWishlist(item.productId._id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
