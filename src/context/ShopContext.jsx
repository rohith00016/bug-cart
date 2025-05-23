import React, { createContext, useState, useEffect } from "react";
import { products } from "../assets/assets"; // Assuming you have a list of products here
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState({});
  const [reviews, setReviews] = useState({});
  const navigate = useNavigate();

  const currency = "$";
  const delivery_fee = 10;

  // Load cart items and wishlist from localStorage on initial load
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }

    const storedWishlistItems = JSON.parse(localStorage.getItem("wishlistItems"));
    if (storedWishlistItems) {
      setWishlistItems(storedWishlistItems);
    }
  }, []);

  // Save cart and wishlist items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [cartItems, wishlistItems]);

  // Add item to cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please Select a Size");
      return;
    } else {
      toast.success("Item Added To The Cart");
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
  };

  // Get the total count of items in the cart
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          // Error Handling
        }
      }
    }
    return totalCount;
  };

  // Get the wishlist count
  const getWishlistCount = () => {
    return Object.keys(wishlistItems).length;  // Count the number of items in wishlistItems
  };

  // Update the quantity of a specific item in the cart
  const updateQuantity = async (itemId, size, quantity) => {
    if (quantity === 0) {
      const productData = products.find((product) => product._id === itemId);
      toast.success("Item Removed From The Cart");
    }

    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);
  };

  // Get the total amount of items in the cart
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

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

  // **Add this reset function**
  const resetContextData = () => {
    setCartItems({});
    setWishlistItems({});
  };

  // 
  const addReview = (productId, review) => {
  setReviews(prev => ({
    ...prev,
    [productId]: [...(prev[productId] || []), review]
  }));
};

  // Context value to be provided to the app components
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setCartItems,
    setWishlistItems,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    wishlistItems,
    getWishlistCount,
    addToWishlist,
    removeFromWishlist,
    navigate,
    resetContextData,
    reviews, addReview
    
    // <-- add here
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
