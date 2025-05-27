import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export const WishlistContext = createContext();

const WishlistContextProvider = ({ children }) => {
  const [wishlistData, setWishlistData] = useState([]);
  const [wishlistItems, setWishlistItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFetched, setIsFetched] = useState(false);
  
  const navigate = useNavigate();

  // Get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("getAuthToken called, token:", token);
    return token;
  };

  // Fetch wishlist from backend
  const getWishlist = useCallback(async () => {
    const token = getAuthToken();
    if (!token || isFetched) {
      console.log("Skipping getWishlist, isFetched:", isFetched);
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log("Fetching wishlist...");
    try {
      const response = await axiosInstance.get(`/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const items = response.data.items || [];
      console.log("Wishlist fetched, response:", response.data);
      setWishlistData(items);
      setWishlistItems(
        items.reduce((acc, item) => {
          acc[item.productId._id] = true;
          return acc;
        }, {})
      );
      setIsFetched(true);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch wishlist";
      setError(errorMsg);
      toast.error(errorMsg);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [isFetched, navigate]);

  // Fetch wishlist on mount if user is logged in
  useEffect(() => {
    if (getAuthToken()) {
      getWishlist();
    }
  }, [getWishlist]);

  // Add to wishlist
  const addToWishlist = async (productId) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please log in to add items to your wishlist");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Adding to wishlist, productId:", productId);
      const response = await axiosInstance.post(
        `/wishlist/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Add to wishlist response:", response.data);
      const items = response.data.items || [];
      setWishlistData(items);
      setWishlistItems(
        items.reduce((acc, item) => {
          acc[item.productId._id] = true;
          return acc;
        }, {})
      );
      toast.success("Item Added To Wishlist");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to add to wishlist";
      console.error("Add to wishlist error:", err.response?.data || err);
      toast.error(errorMsg);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please log in to remove items from your wishlist");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Removing from wishlist, productId:", productId);
      const response = await axiosInstance.post(
        `/wishlist/remove`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Remove from wishlist response:", response.data);
      const items = response.data.items || [];
      setWishlistData(items);
      setWishlistItems(
        items.reduce((acc, item) => {
          acc[item.productId._id] = true;
          return acc;
        }, {})
      );
      toast.success("Item Removed From Wishlist");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to remove from wishlist";
      console.error("Remove from wishlist error:", err.response?.data || err);
      toast.error(errorMsg);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset wishlist (e.g., on logout)
  const resetWishlist = () => {
    setWishlistData([]);
    setWishlistItems({});
    setIsFetched(false);
  };

  const value = {
    wishlistData,
    wishlistItems,
    setWishlistItems,
    isLoading,
    error,
    currency: "$",
    addToWishlist,
    removeFromWishlist,
    fetchWishlist: getWishlist,
    resetWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContextProvider;