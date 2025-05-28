import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://bug-cart-server.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
    // Add Authorization header if needed:
    // Authorization: `Bearer ${yourToken}`
  },
});

export default axiosInstance;
