import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const RelatedProducts = ({ category, subCategory }) => {
  const { products, isLoading } = useContext(ProductContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      let productsCopy = products.filter((item) => category === item.category);
      productsCopy = productsCopy.filter(
        (item) => subCategory === item.subCategory
      );
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory]);

  return (
    <div className="my-24">
      <div className="py-2 text-3xl text-center">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      {isLoading ? (
        <p>Loading related products...</p>
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
