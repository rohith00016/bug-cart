import { useState, useEffect } from "react";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [formData, setFormData] = useState({
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    mobile: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your profile.");
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/api/auth/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { userDetail } = response.data;
        setFormData({
          email: userDetail.email || "",
          street: userDetail.shippingAddress?.address || "",
          city: userDetail.shippingAddress?.city || "",
          state: userDetail.shippingAddress?.state || "",
          zip: userDetail.shippingAddress?.zip || "",
          country: userDetail.shippingAddress?.country || "",
          mobile: userDetail.mobile || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data");
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Please log in to update your profile.");
        return;
      }

      const payload = {
        email: formData.email,
        mobile: formData.mobile,
        shippingAddress: {
          address: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
      };

      const response = await axios.post(
        "http://localhost:3000/api/auth/update-profile",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update sessionStorage
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          email: response.data.user.email,
          street: response.data.user.shippingAddress.address,
          city: response.data.user.shippingAddress.city,
          state: response.data.user.shippingAddress.state,
          zip: response.data.user.shippingAddress.zip,
          country: response.data.user.shippingAddress.country,
          mobile: response.data.user.mobile,
        })
      );

      toast.success(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] border-t pt-[5%] sm:pt-10">
      <div className="flex flex-col gap-4 w-full max-w-[480px]">
        <div className="text-xl sm:text-2xl text-center">
          <Title text1={"PROFILE"} text2={"DETAILS"} />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          type="email"
          placeholder="Email Address"
        />
        <input
          name="street"
          value={formData.street}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="City"
          />
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="Zip Code"
          />
          <input
            name="country"
            value={formData.country}
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
          type="tel"
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
