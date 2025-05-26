import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [wishlistItems, setWishlistItems] = useState({});
  const navigate = useNavigate();

  // Load wishlist from localStorage on initial load
  useEffect(() => {
    const storedWishlistItems = JSON.parse(
      localStorage.getItem("wishlistItems")
    );
    if (storedWishlistItems) {
      setWishlistItems(storedWishlistItems);
    }
  }, []);

  // Save wishlist items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Add item to wishlist
  const addToWishlist = (itemId) => {
    setWishlistItems((prev) => ({ ...prev, [itemId]: true }));
  };

  // Remove item from wishlist
  const removeFromWishlist = (itemId) => {
    const updated = { ...wishlistItems };
    delete updated[itemId];
    setWishlistItems(updated);
  };

  // Get the wishlist count
  const getWishlistCount = () => {
    return Object.keys(wishlistItems).length;
  };

  // Reset context data (for logout)
  const resetContextData = () => {
    setWishlistItems({});
  };

  const value = {
    search,
    setSearch,
    showSearch,
    setShowSearch,
    wishlistItems,
    setWishlistItems,
    getWishlistCount,
    addToWishlist,
    removeFromWishlist,
    navigate,
    resetContextData,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
