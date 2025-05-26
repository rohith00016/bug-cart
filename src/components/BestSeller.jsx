import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products, isLoading } = useContext(ProductContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const bestProduct = products.filter((item) => item.bestseller);
      setBestSeller(bestProduct.slice(0, 5));
    }
  }, [products]);

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
      ) : bestSeller.length === 0 ? (
        <p>No best sellers available.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
          {bestSeller.map((item, index) => (
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
