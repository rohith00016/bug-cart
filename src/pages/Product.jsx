import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ProductContext } from "../context/ProductContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

const Product = () => {
  const { productId } = useParams();
  const { currency, addToCart } = useContext(CartContext);
  const { fetchProductById } = useContext(ProductContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [selectedTab, setSelectedTab] = useState("description");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  // Todo : To Get Product & Reviews Data
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const product = await fetchProductById(productId);
        const response = await axiosInstance.get(`/review/${productId}`);
        setFeedbacks(response.data);

        if (product) {
          setProductData(product);
          setImage(product.image[0]);
        } else {
          setError("Product not found");
          toast.error("Product not found");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch product");
        toast.error(err.message || "Failed to fetch product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, fetchProductById]);

  // Todo : To delete a review
  // const deleteReview = async (reviewId) => {
  //   try {
  //     await axiosInstance.delete(`/review/${reviewId}`);
  //     const updatedReviews = feedbacks.filter(
  //       (review) => review._id !== reviewId
  //     );
  //     setFeedbacks(updatedReviews);
  //     toast.success("Review deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting review:", error);
  //     toast.error("Failed to delete review");
  //   }
  // };

  const productReviews = feedbacks;

  if (isLoading) {
    return <div className="pt-10 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="pt-10 text-center text-red-500">{error}</div>;
  }

  return productData ? (
    <div className="pt-10 transition-opacity duration-500 ease-in border-t-2 opacity-100">
      {/* Product Content */}
      <div className="flex flex-col gap-12 sm:gap-12 sm:flex-row">
        {/* Images */}
        <div className="flex flex-col-reverse flex-1 gap-3 sm:flex-row">
          <div className="flex justify-between overflow-x-auto sm:flex-col sm:overflow-y-scroll sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                src={`https://bug-cart-server.onrender.com/images/${item}.png`}
                key={index}
                onClick={() => setImage(item)}
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer ${
                  image === item ? "border-2 border-gray-600 py-2 px-2" : ""
                }`}
                alt="Photo"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              src={`https://bug-cart-server.onrender.com/images/${image}.png`}
              className="w-full h-auto"
              alt="Product"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="mt-2 text-2xl font-medium">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => {
              return (
                <>
                  <img
                    key={i}
                    src={
                      i < productReviews.averageRating
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    alt="Star"
                    className="w-3.5 h-3.5"
                  />
                </>
              );
            })}
            {""}
            {productReviews.averageRating} ({productReviews.count})
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 rounded-md ${
                    item === size ? "border-orange-500" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size)}
            className="px-8 py-3 text-sm text-white bg-black active:bg-gray-700"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="flex flex-col gap-1 mt-5 text-sm text-gray-500">
            <p>Guaranteed 100% Authentic – Shop with Confidence!</p>
            <p>Enjoy Cash on Delivery – Pay at Your Doorstep!</p>
            <p>
              Hassle-Free Returns & Exchanges – 10 Days, No Questions Asked!
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-20">
        <div className="flex border-b">
          <button
            className={`px-5 py-3 text-sm border-r ${
              selectedTab === "description"
                ? "font-bold border-t border-l border-black bg-white"
                : "text-gray-500"
            }`}
            onClick={() => setSelectedTab("description")}
          >
            Description
          </button>
          <button
            className={`px-5 py-3 text-sm ${
              selectedTab === "reviews"
                ? "font-bold border-t border-black border-l bg-white"
                : "text-gray-500"
            }`}
            onClick={() => setSelectedTab("reviews")}
          >
            Reviews ({productReviews.reviews.length})
          </button>
        </div>

        {selectedTab === "description" ? (
          <div className="flex flex-col gap-4 px-6 py-6 text-sm text-gray-500 border">
            <p>{productData.description}</p>
            <p>
              Elevate your style with our meticulously crafted Trendify quality
              products. Designed with a perfect balance of elegance and
              practicality...
            </p>
          </div>
        ) : (
          <div className="px-6 py-6 text-sm text-gray-500 border">
            {productReviews.reviews.length === 0 ? (
              <p>No reviews submitted yet.</p>
            ) : (
              productReviews.reviews.map(
                ({ rating, comment, createdAt, userId }, idx) => (
                  <div key={idx} className="border-b py-4">
                    <p className="text-xs text-gray-400 mb-2.5">
                      {userId?.name && <span>{userId.name} · </span>}
                      {new Date(createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <img
                          key={i}
                          src={
                            i < rating
                              ? assets.star_icon
                              : assets.star_dull_icon
                          }
                          alt="Star"
                          className="w-3.5 h-3.5"
                        />
                      ))}
                    </div>
                    <p className="mt-2 font-medium">{comment}</p>
                  </div>
                )
              )
            )}
          </div>
        )}
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
