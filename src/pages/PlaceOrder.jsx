import { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { OrderContext } from "../context/OrderContext";
import SuccessModal from "../components/SuccessModal";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [showModal, setShowModal] = useState(false);
  const { navigate, cartItems, resetContextData } = useContext(ShopContext);
  const { placeOrder } = useContext(OrderContext);

  // State for shipping address
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    mobile: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    // Validate shipping address
    if (
      !shippingAddress.firstName ||
      !shippingAddress.lastName ||
      !shippingAddress.email ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country ||
      !shippingAddress.mobile
    ) {
      alert("Please fill in all shipping address fields");
      return;
    }

    try {
      await placeOrder(
        {
          address: `${shippingAddress.address}, ${shippingAddress.firstName} ${shippingAddress.lastName}, ${shippingAddress.mobile}`,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        cartItems,
        resetContextData
      );
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
          <div className="flex gap-3">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded"
              type="text"
              name="firstName"
              placeholder="First Name"
              value={shippingAddress.firstName}
              onChange={handleInputChange}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded"
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={shippingAddress.lastName}
              onChange={handleInputChange}
            />
          </div>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="email"
            name="email"
            placeholder="Email Address"
            value={shippingAddress.email}
            onChange={handleInputChange}
          />
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
