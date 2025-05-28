import { useEffect, useState } from "react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import useProduct from "../hooks/useProduct";
import { toast } from "react-toastify";

const RelatedProducts = ({ category, subCategory }) => {
  const { fetchRelatedProducts } = useProduct();
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (category && subCategory) {
        setIsLoading(true);
        try {
          const products = await fetchRelatedProducts(category, subCategory);
          setRelated(products);
        } catch (err) {
          setError(err.message || "Failed to fetch related products");
          toast.error(err.message || "Failed to fetch related products");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [category, subCategory, fetchRelatedProducts]);

  return (
    <div className="my-24">
      <div className="py-2 text-3xl text-center">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      {isLoading ? (
        <p>Loading related products...</p>
      ) : error ? (
        <p>{error}</p>
      ) : related.length === 0 ? (
        <p>No related products available.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
          {related.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
