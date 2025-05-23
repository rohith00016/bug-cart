import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';  // Make sure this import path is correct

const ReviewModal = ({ product, onClose }) => {
  const { addReview } = useContext(ShopContext);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  if (!product) return null;

  const handleSubmit = () => {
    if (!rating) {
      alert("Please select a rating");
      return;
    }
    // Save review in context
    addReview(product._id, { rating, review, date: new Date().toISOString() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md p-6 rounded-md shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 text-xl">&times;</button>

        <div className="flex gap-4">
          <img src={product.image[0]} alt="Product" className="w-24 h-24 object-cover rounded" />
          <div>
            <p className="text-lg font-semibold">{product.name}</p>
            <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium">Your Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const isActive = star <= (hover || rating);
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="focus:outline-none"
                >
                  <img
                    src={assets.star_icon}
                    alt="Star"
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'opacity-100' : 'opacity-30'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Review Textarea */}
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium">Your Review</label>
          <textarea
            rows="4"
            className="w-full border px-3 py-2 rounded resize-none"
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        <div className="mt-4 text-right">
          <button
            className="px-4 py-2 bg-black text-white rounded-sm"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
