import { useContext, useEffect, useState } from "react";
import { OrderContext } from "../context/OrderContext";
import Title from "../components/Title";
import ReviewModal from "../components/ReviewModal";

const Orders = () => {
  const { orders, fetchUserOrders } = useContext(OrderContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const openModal = (product) => {
    console.log(product);

    setSelectedProduct({ ...product });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen sm:max-w-[90%] mx-auto">
      {/* Header Section */}
      <div>
        <div className="px-4 sm:px-6 lg:px-8 pt-20 ">
          <div className="">
            <Title text1={"YOUR"} text2={"ORDERS"} />
            <p className="mt-2 text-gray-600">
              Track and review your recent purchases
            </p>
          </div>
        </div>
      </div>

      {/* Orders Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600">
              Your order history will appear here once you make your first
              purchase.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, orderIndex) => (
              <div
                key={orderIndex}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between text-white">
                    <h2 className="text-lg font-semibold">
                      Order #{orderIndex + 1}
                    </h2>
                    <p className="text-md mt-1">
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="divide-y divide-gray-100">
                  {order.items.map((product, productIndex) => (
                    <div
                      key={productIndex}
                      className="p-6 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            {/* Product Image Placeholder */}
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                              </svg>
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {product.productId.name}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="font-medium">
                                  ${product.price}
                                </span>
                                <span>×</span>
                                <span>Quantity: {product.quantity}</span>
                                <span className="font-semibold text-gray-900">
                                  Total: $
                                  {(product.price * product.quantity).toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Review Button */}
                        <button
                          onClick={() => openModal(product)}
                          className="ml-4 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Delivery Address
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.city} -{" "}
                        {order.shippingAddress.postalCode},{" "}
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <ReviewModal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
};

export default Orders;
