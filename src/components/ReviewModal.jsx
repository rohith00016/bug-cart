import { useState, useContext } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { ReviewContext } from "../context/ReviewContext";

export default function ReviewModal({ product, onClose }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addReview } = useContext(ReviewContext);

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        productId: product?.productId?._id,
        productName: product?.productId?.name,
        rating,
        comment: reviewText,
        price: product?.price,
      };

      // Add review to context
      addReview(product?.productId?._id, reviewData);

      // Todo: Replace with actual API call
      const res = await axiosInstance.post("/review", reviewData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Check if the response status
      if (res.status !== 201) {
        throw new Error("Failed to submit review");
      }
      toast.success("Review submitted. Thank you!");
      setIsModalOpen(false);
      onClose(); // Call the onClose function to close the modal
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    onClose();
  };

  const getRatingText = (rating) => {
    const texts = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return texts[rating] || "Click to rate";
  };

  // If product data is not available, show loading or error state
  if (!product || !product.productId) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <p className="text-gray-600">Product information not available</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10"
        >
          ×
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Write a Review
            </h2>
            <p className="text-gray-600 text-sm">
              Share your experience with this product
            </p>
          </div>

          {/* Product Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-4">
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
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm">
                  {product.productId.name}
                </h3>
                <p className="text-gray-600 text-xs">
                  Quantity: {product.quantity}
                </p>
                <p className="text-neutral-800 font-semibold text-sm">
                  ${product.price}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Star Rating */}
            <div>
              <div className="block text-sm font-semibold text-gray-700 mb-3">
                Your Rating
              </div>
              <div className="flex space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className={`text-4xl transition-all duration-200 hover:scale-110 focus:outline-none ${
                      star <= rating
                        ? "text-orange-500"
                        : "text-gray-300 hover:text-orange-500"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-gray-600 text-sm font-medium">
                {getRatingText(rating)}
              </p>
            </div>

            {/* Review Text */}
            <div>
              <div className="block text-sm font-semibold text-gray-700 mb-3">
                Your Review (Optional)
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
                placeholder="Tell us about your experience with this product..."
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-neutral-800 hover:bg-neutral-900 text-white hover:shadow-lg"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
