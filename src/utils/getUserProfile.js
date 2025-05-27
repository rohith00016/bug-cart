import axiosInstance from "../utils/axiosInstance";
  
const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    //validatte token presence
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axiosInstance.get("/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch user profile";
    console.error("User Profile Error:", errorMessage);
    throw new Error(errorMessage);
  }
};

export default getUserProfile;
