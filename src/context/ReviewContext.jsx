import { createContext, useState } from "react";

export const ReviewContext = createContext();

const ReviewContextProvider = ({ children }) => {
  const [reviews, setReviews] = useState({});

  // Add a review for a product
  const addReview = (productId, review) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: [...(prev[productId] || []), review],
    }));
  };

  const value = {
    reviews,
    addReview,
  };

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
};

export default ReviewContextProvider;
