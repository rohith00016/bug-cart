import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const OrderContext = createContext();

const OrderContextProvider = (props) => {
  const [orders, setOrders] = useState([]);
  const apiBaseUrl = "http://localhost:8000/api";

  // Fetch user orders
  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiBaseUrl}/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      throw error;
    }
  };

  // Place a new order
  const placeOrder = async (shippingAddress, cartItems, resetCart) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${apiBaseUrl}/order`,
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

  const value = {
    orders,
    fetchUserOrders,
    placeOrder,
  };

  return (
    <OrderContext.Provider value={value}>
      {props.children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;
