import { useContext, useState } from "react";
import { OrderContext } from "../context/OrderContext"; // Make sure the path is correct
import Title from "../components/Title";
import ReviewModal from "../components/ReviewModal";

const Orders = () => {
  const { orders } = useContext(OrderContext); // Use orders from context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = (product) => {
    setSelectedProduct({ ...product });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="pt-16 border-t">
      <div className="text-2xl">
        <Title text1={"YOUR"} text2={"ORDERS"} />
      </div>

      <div>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 py-4 text-gray-700 border-t border-b md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20"
                  src={order.product.image[0]}
                  alt="Product"
                />
                <div>
                  <p className="font-medium sm:text-base">
                    {order.product.name}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                    <p className="text-lg">
                      ₹ {order.product.price.toFixed(2)}
                    </p>
                    <p>Quantity: {order.quantity}</p>
                    <p>Size: {order.size || "M"}</p>
                  </div>
                  <p className="mt-2">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex justify-between md:w-1/2">
                <div className="flex items-center gap-2">
                  <p className="h-2 bg-green-500 rounded-full min-w-2"></p>
                  <p className="text-sm md:text-base">Ready for Shipping</p>
                </div>
                <button
                  onClick={() => openModal(order.product)}
                  className="px-4 py-2 text-sm font-medium border rounded-sm"
                >
                  RATE & REVIEW
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-10 text-gray-500">No orders found.</p>
        )}
      </div>

      {isModalOpen && (
        <ReviewModal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
};

export default Orders;
