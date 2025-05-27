import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { ProductContext } from "../context/ProductContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import LoginPromptModal from "../components/LoginPromptModal";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const Cart = () => {
  const {
    cartItems,
    currency,
    updateQuantity,
    navigate,
    getCart,
    isLoading,
    error,
  } = useContext(CartContext);
  const { products } = useContext(ProductContext);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch cart on component mount
  useEffect(() => {
    getCart();
  }, []);

  const isCartEmpty = cartItems.length === 0;

  // Check login based on token presence
  const isLoggedIn =
    !!sessionStorage.getItem("token") || !!localStorage.getItem("token");

  return (
    <div className="border-t pt-14">
      <div className="mb-3 text-2xl">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {isLoading && <p>Loading cart...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div>
        {cartItems.map((item) => {
          console.log("Cart Item:", JSON.stringify(item, null, 2)); // Log item structure
          const productData = products.find(
            (product) => product._id === item.productId._id
          );
          if (!productData) {
            console.warn(`Product not found for ID: ${item.productId._id}`, item);
            return (
              <div key={item.productId._id} className="py-4 text-gray-500">
                Product data unavailable (ID: {item.productId._id}) - Quantity: {item.quantity}
              </div>
            );
          }

          return (
            <div
              key={item.productId._id}
              className="grid py-4 text-gray-700 border-t border-b grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={`${productData.image[0]}`}
                  alt="Photo"
                />
                <div>
                  <p className="text-sm font-medium sm:text-lg">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency} {productData.price.toFixed(2)}
                    </p>
                    <p className="px-2 border sm:px-3 sm:py-1 bg-slate-50">
                      {item.size || "N/A"} {/* Display item.size */}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center">
                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId._id,
                      item.size, // Pass item.size
                      Math.max(item.quantity - 1, 0)
                    )
                  }
                  className="text-gray-700 hover:text-black"
                  aria-label="Decrease quantity"
                >
                  <AiOutlineMinus size={20} />
                </button>
                <input
                  onChange={(e) => {
                    if (e.target.value !== "" && e.target.value !== "0") {
                      updateQuantity(
                        item.productId._id,
                        item.size, // Pass item.size
                        Number(e.target.value)
                      );
                    }
                  }}
                  className="px-1 py-1 border max-w-12 text-center sm:max-w-20 sm:px-2"
                  type="number"
                  min={1}
                  value={item.quantity}
                  readOnly={false}
                />
                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId._id,
                      item.size, // Pass item.size
                      item.quantity + 1
                    )
                  }
                  className="text-gray-700 hover:text-black"
                  aria-label="Increase quantity"
                >
                  <AiOutlinePlus size={20} />
                </button>
              </div>

              <img
                onClick={() => updateQuantity(item.productId._id, item.size, 0)} // Pass item.size
                className="w-4 mr-4 cursor-pointer sm:w-5"
                src={assets.bin_icon}
                alt="Remove"
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setShowLoginModal(true);
                } else {
                  navigate("/place-order");
                }
              }}
              className={`px-8 py-3 my-8 text-sm text-white bg-black active:bg-gray-700 ${
                isCartEmpty ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isCartEmpty}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <LoginPromptModal
          onClose={() => setShowLoginModal(false)}
          onLogin={() => navigate("/login")}
          onSignup={() => navigate("/signup")}
        />
      )}
    </div>
  );
};

export default Cart;