import { useEffect, useState } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import useProduct from "../hooks/useProduct";
import { toast } from "react-toastify";

const BestSeller = () => {
  const { fetchBestSellers } = useProduct();
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchBestSellers({ page: 1 });
        setBestSellers(data.products.slice(0, 5)); // Limit to 5 as per original logic
      } catch (err) {
        setError(err.message || "Failed to fetch bestsellers");
        toast.error(err.message || "Failed to fetch bestsellers");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchBestSellers]);

  return (
    <div className="my-10">
      <div className="py-8 text-3xl text-center">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base">
          Our best sellers are a curated selection of top-rated items that have
          won over shoppers with their quality, style, and value.
        </p>
      </div>
      {isLoading ? (
        <p>Loading best sellers...</p>
      ) : error ? (
        <p>{error}</p>
      ) : bestSellers.length === 0 ? (
        <p>No best sellers available.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
          {bestSellers.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSeller;