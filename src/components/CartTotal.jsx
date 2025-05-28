import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(CartContext);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTAL"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p className="text-lg font-medium">Sub Total</p>
          <p className="text-lg font-medium">
            {currency}{" "}
            {getCartAmount().toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p className="text-lg font-medium">Shipping Fee</p>
          <p className="text-lg font-medium">
            {currency}{" "}
            {delivery_fee.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <hr />
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Enter coupon code (e.g., OFF20)"
              className="w-full sm:w-2/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
            <button className="w-full sm:w-1/3 bg-black text-white p-2 rounded  transition-colors text-base font-medium opacity-50 cursor-not-allowed">
              Apply Coupon
            </button>
          </div>
        </div>
        <hr />
        <div className="flex justify-between">
          <p className="text-2xl font-semibold">Total Amount</p>
          <p className="text-2xl font-semibold">
            {currency}{" "}
            {(getCartAmount() === 0
              ? 0
              : getCartAmount() + delivery_fee
            ).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
