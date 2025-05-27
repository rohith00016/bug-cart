import { createContext, useState } from "react";

export const ReviewContext = createContext();

const ReviewContextProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]); // stays as an array

  // Add a review to the reviews
  const addReview = (productId, review) => {
    setReviews((prevReviews) => [
      ...prevReviews,
      { productId, ...review },
    ]);
  };
  
  return (
    <ReviewContext.Provider value={{ reviews, addReview }}>
      {children}
    </ReviewContext.Provider>
  );
};

export default ReviewContextProvider;
