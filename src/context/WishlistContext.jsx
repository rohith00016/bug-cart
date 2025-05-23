import { createContext, useState, useContext } from "react";
import { ShopContext } from "./ShopContext.jsx";
import { toast } from "react-toastify";

// Create the WishlistContext
export const WishlistContext = createContext();

// WishlistContext Provider
const WishlistContextProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState({}); // { productId: true }
  const [wishlistData, setWishlistData] = useState([]); // Full product details
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("$"); // Default currency

  const shopContext = useContext(ShopContext);
  if (!shopContext) {
    throw new Error(
      "WishlistContextProvider must be used within a ShopContextProvider"
    );
  }
  const { navigate } = shopContext;

  // Abstracted function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Please log in to view your wishlist");
      toast.error("Please log in to view your wishlist");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/wishlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setError("Session expired. Please log in again.");
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch wishlist");
      }

      setWishlistData(data.items.map((item) => item.productId));
      const items = data.items.reduce((acc, item) => {
        acc[item.productId._id] = true;
        return acc;
      }, {});
      setWishlistItems(items);
    } catch (err) {
      setError(err.message || "Failed to fetch wishlist");
      toast.error(err.message || "Failed to fetch wishlist");
    }
    setIsLoading(false);
  };

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please log in to add items to your wishlist");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error(data.message || "Failed to add to wishlist");
      }

      const productResponse = await fetch(
        `http://localhost:8000/api/product/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const productData = await productResponse.json();
      if (!productResponse.ok) {
        if (productResponse.status === 401) {
          setError("Session expired. Please log in again.");
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error(productData.message || "Failed to fetch product");
      }

      setWishlistItems((prev) => ({ ...prev, [productId]: true }));
      setWishlistData((prev) => [...prev, productData]);
      toast.success("Product added to wishlist");
    } catch (err) {
      toast.error(err.message || "Failed to add to wishlist");
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please log in to remove items from your wishlist");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/wishlist/remove",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error(data.message || "Failed to remove from wishlist");
      }

      setWishlistItems((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
      setWishlistData((prev) => prev.filter((item) => item._id !== productId));
      toast.success("Product removed from wishlist");
    } catch (err) {
      toast.error(err.message || "Failed to remove from wishlist");
    }
  };

  const value = {
    wishlistItems,
    setWishlistItems,
    wishlistData,
    setWishlistData,
    isLoading,
    setIsLoading,
    error,
    setError,
    currency,
    setCurrency,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContextProvider;
