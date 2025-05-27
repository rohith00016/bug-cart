import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

export const OrderContext = createContext();

const OrderContextProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Bug: Fetch user orders
  const fetchUserOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. User may not be authenticated.");
      return;
    }

    try {
      const response = await axiosInstance.get(`/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
    }
  };

  // Place a new order
  const placeOrder = async (shippingAddress, cartItems, resetCart) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(
        `/order`,
        { shippingAddress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Order placed successfully!");
      resetCart(); // Clear the cart after successful order
      return response.data;
    } catch (error) {
      toast.error(
        "Failed to place order: " +
          (error.response?.data?.error || error.message)
      );
      throw error;
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, fetchUserOrders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;
