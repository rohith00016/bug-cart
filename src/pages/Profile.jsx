import { useState, useEffect } from "react";
import Title from "../components/Title";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import {useAuth} from "../context/AuthContext"

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    mobile: "",
  });
  const { getUserProfile } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      try {
        const response = await getUserProfile(storedUser);
        const user = response
        setFormData({
          name: user.name || "",
          email: user.email || "",
          shippingAddress: {
            street: user.shippingAddress?.street || "",
            city: user.shippingAddress?.city || "",
            state: user.shippingAddress?.state || "",
            zip: user.shippingAddress?.zip || "",
            country: user.shippingAddress?.country || "",
          },
          mobile: user.mobile || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("shippingAddress.")) {
      const addressField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        shippingAddress: {
          ...prevData.shippingAddress,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    const payload = {
      email: formData.email,
      shippingAddress: { ...formData.shippingAddress },
      mobile: formData.mobile,
    };

    try {
      const response = await axiosInstance.post(
        `/auth/update-profile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
   

      if (response.status === 200) {
        toast.success("Profile updated!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };
  console.log(formData)
  return (
    <div className="flex items-center justify-center min-h-[80vh] border-t pt-[5%] sm:pt-10">
      <div className="flex flex-col gap-4 w-full max-w-[480px]">
        <div className="text-xl sm:text-2xl text-center">
          <Title text1={"PROFILE"} text2={"DETAILS"} />
        </div>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          type="text"
          placeholder="Name"
        />

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          type="email"
          placeholder="Email Address"
        />
        <input
          name="shippingAddress.street"
          value={formData.shippingAddress.street}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          type="text"
          placeholder="Street"
        />

        <div className="flex gap-3">
          <input
            name="shippingAddress.city"
            value={formData.shippingAddress.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="City"
          />
          <input
            name="shippingAddress.state"
            value={formData.shippingAddress.state}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            name="shippingAddress.zip"
            value={formData.shippingAddress.zip}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="Zip Code"
          />
          <input
            name="shippingAddress.country"
            value={formData.shippingAddress.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          type="text"
          placeholder="Mobile"
        />
        <div className="w-full mt-4 text-end">
          <button
            onClick={handleSave}
            className="px-16 py-3 text-sm text-white bg-black active:bg-gray-800"
          >
            SAVE PROFILE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
