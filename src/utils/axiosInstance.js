import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    // Add Authorization header if needed:
    // Authorization: `Bearer ${yourToken}`
  },
});

export default axiosInstance;
