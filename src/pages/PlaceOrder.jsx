import { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { OrderContext } from "../context/OrderContext";
import SuccessModal from "../components/SuccessModal";
import axios from "axios";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [showModal, setShowModal] = useState(false);
  const { navigate, cartItems, resetContextData } = useContext(ShopContext);
  const { placeOrder } = useContext(OrderContext);
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    mobile: "",
  });
  const [error, setError] = useState("");

  // Fetch user’s shipping address
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token =
          sessionStorage.getItem("token") || localStorage.getItem("token");
        if (!token) {
          setError("Please log in to place an order.");
          return;
        }
        const response = await axios.get(
          "http://localhost:8000/api/auth/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { shippingAddress, mobile } = response.data.userDetail;
        if (shippingAddress) {
          setShippingAddress({
            address: shippingAddress.address || "",
            city: shippingAddress.city || "",
            state: shippingAddress.state || "",
            postalCode: shippingAddress.zip || "",
            country: shippingAddress.country || "",
            mobile: mobile || "",
          });
        }
      } catch (err) {
        setError("Failed to fetch user data");
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    // Validate shipping address
    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.country ||
      !shippingAddress.mobile
    ) {
      alert("Please fill in all shipping address fields");
      return;
    }

    try {
      await placeOrder(shippingAddress, cartItems, resetContextData);
      setShowModal(true);
    } catch (error) {
      // Error is handled in OrderContext via toast
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/orders");
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t">
        {/* Left Side Content */}
        <div className="flex flex-col w-full gap-4 sm:max-w-[480px]">
          <div className="my-3 text-xl sm:text-2xl">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            name="address"
            placeholder="Street"
            value={shippingAddress.address}
            onChange={handleInputChange}
          />
          <div className="flex gap-3">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded"
              type="text"
              name="city"
              placeholder="City"
              value={shippingAddress.city}
              onChange={handleInputChange}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded"
              type="text"
              name="state"
              placeholder="State"
              value={shippingAddress.state}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex gap-3">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded"
              type="text"
              name="postalCode"
              placeholder="Zip Code"
              value={shippingAddress.postalCode}
              onChange={handleInputChange}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded"
              type="text"
              name="country"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={handleInputChange}
            />
          </div>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="tel"
            name="mobile"
            placeholder="Mobile"
            value={shippingAddress.mobile}
            onChange={handleInputChange}
          />
        </div>

        {/* Right Side Content */}
        <div className="mt-8">
          <div className="mt-8 min-w-80">
            <CartTotal />
          </div>

          {/* Payment Methods Selection */}
          <div className="mt-12">
            <Title text1={"PAYMENT"} text2={"METHODS"} />
            <div className="flex flex-col gap-3 lg:flex-row">
              <div
                onClick={() => setMethod("stripe")}
                className="flex items-center gap-3 p-2 px-3 border cursor-pointer"
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === "stripe" ? "bg-green-600" : ""
                  }`}
                ></p>
                <img
                  className="h-5 mx-4"
                  src={assets.stripe_logo}
                  alt="Stripe"
                />
              </div>
              <div
                onClick={() => setMethod("razorpay")}
                className="flex items-center gap-3 p-2 px-3 border cursor-pointer"
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === "razorpay" ? "bg-green-600" : ""
                  }`}
                ></p>
                <img
                  className="h-5 mx-4"
                  src={assets.razorpay_logo}
                  alt="RazorPay"
                />
              </div>
              <div
                onClick={() => setMethod("cod")}
                className="flex items-center gap-3 p-2 px-3 border cursor-pointer"
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === "cod" ? "bg-green-600" : ""
                  }`}
                ></p>
                <p className="mx-4 text-sm font-medium text-gray-500">
                  CASH ON DELIVERY
                </p>
              </div>
            </div>

            <div className="w-full mt-8 text-end">
              <button
                onClick={handlePlaceOrder}
                className="px-16 py-3 text-sm text-white bg-black active:bg-gray-800"
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && <SuccessModal onClose={handleModalClose} />}
    </>
  );
};

export default PlaceOrder;
