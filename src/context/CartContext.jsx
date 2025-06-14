import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "./ProductContext";
import axiosInstance from "../utils/axiosInstance";

export const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const currency = "$";
  const delivery_fee = 10;
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Fetch cart from backend
  const getCart = async () => {
    const token = getAuthToken();
    if (!token) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.items || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch cart");
      toast.error(err.response?.data?.error || "Failed to fetch cart");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart on mount if user is logged in
  useEffect(() => {
    if (getAuthToken()) {
      getCart();
    }
  }, []);

  // Add item to cart
  const addToCart = async (productId, size) => {
    if (!size) {
      toast.error("Please Select a Size");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      toast.error("Please log in to add items to your cart");
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/cart/add",
        { productId, quantity: 1, size },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.items || []);
      toast.success("Item Added To The Cart");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add to cart");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, size, quantity) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please log in to update your cart");
      navigate("/login");
      return;
    }

    try {
      if (quantity === 0) {
        await removeFromCart(productId, size);
        return;
      }

      const currentItem = cartItems.find(
        (item) => item.productId._id === productId && item.size === size
      );
      const endpoint =
        quantity > (currentItem?.quantity || 0)
          ? `/cart/increase`
          : `/cart/decrease`;

      const response = await axiosInstance.post(
        endpoint,
        { productId, size },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.items || !Array.isArray(response.data.items)) {
        console.error("Invalid response: items is not an array", response.data);
        throw new Error("Invalid cart items response from server");
      }

      setCartItems(response.data.items);

      toast.success(
        quantity === 0 ? "Item Removed From The Cart" : "Cart Updated"
      );
    } catch (err) {
      console.error("Update Quantity Error:", err);
      toast.error(err.response?.data?.error || "Failed to update cart");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId, size) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please log in to remove items from your cart");
      navigate("/login");
      return;
    }
    // Bug : Why do we need post method here? over DELETE method
    try {
      const response = await axiosInstance.post(
        `/cart/remove`,
        { productId, size },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.items || []);
      toast.success("Item Removed From The Cart");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to remove from cart");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // Get total cart count
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // Get total cart amount
  const getCartAmount = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find((p) => p._id === item.productId._id);
      return total + (product?.price || 0) * (item.quantity || 0);
    }, 0);
  };

  // Reset cart (e.g., on logout)
  const resetCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    setCartItems,
    isLoading,
    error,
    currency,
    delivery_fee,
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartCount,
    getCartAmount,
    resetCart,
    navigate,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContextProvider;
