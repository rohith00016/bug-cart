import { useEffect, useState } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import useProduct from "../hooks/useProduct";
import { toast } from "react-toastify";

const LatestCollection = () => {
  const { fetchLatestProducts } = useProduct();
  const [latestProducts, setLatestProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchLatestProducts({ page: 1 });
        setLatestProducts(data.products.slice(0, 10)); // Limit to 10 as per original logic
      } catch (err) {
        setError(err.message || "Failed to fetch latest products");
        toast.error(err.message || "Failed to fetch latest products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchLatestProducts]);

  return (
    <div className="my-10">
      <div className="py-8 text-3xl text-center">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base">
          Step into a world of style with our newest collections, carefully
          curated to bring you the best in fashion, home decor, and more.
        </p>
      </div>
      {isLoading ? (
        <p>Loading latest collections...</p>
      ) : error ? (
        <p>{error}</p>
      ) : latestProducts.length === 0 ? (
        <p>No latest products available.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
          {latestProducts.map((item, index) => (
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

export default LatestCollection;