import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, fetchProducts, totalPages, isLoading, error } =
    useContext(ProductContext);
  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [page, setPage] = useState(1);

  const getQueryParams = () => ({
    page,
    sort:
      sortType === "low-high"
        ? "lowToHigh"
        : sortType === "high-low"
        ? "highToLow"
        : "",
    category: category.join(","),
    subCategory: subCategory.join(","),
  });

  useEffect(() => {
    fetchProducts(getQueryParams());
  }, [fetchProducts, category, subCategory, sortType, page]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    setPage(1);
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setSortType("relevant");
    setPage(1);
  };

  const handlePrevious = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="flex flex-col gap-1 pt-10 border-t sm:flex-row sm:gap-10">
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 my-2 text-xl cursor-pointer"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt="Dropdown"
          />
        </p>
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Men", "Women", "Kids"].map((cat) => (
              <label key={cat} className="flex gap-2 cursor-pointer">
                <input
                  className="w-3"
                  type="checkbox"
                  value={cat}
                  onChange={toggleCategory}
                  checked={category.includes(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Topwear", "Bottomwear", "Winterwear"].map((type) => (
              <label key={type} className="flex gap-2 cursor-pointer">
                <input
                  className="w-3"
                  type="checkbox"
                  value={type}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        {(category.length > 0 ||
          subCategory.length > 0 ||
          sortType !== "relevant") && (
          <button
            className={`px-4 py-2 mt-1 text-white bg-black rounded hover:bg-gray-900 ${
              showFilter ? "block" : "hidden"
            } sm:block`}
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="flex-1">
        <div className="flex justify-between mb-4 text-base sm:text-2xl">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select
            onChange={(e) => {
              setSortType(e.target.value);
              setPage(1);
            }}
            value={sortType}
            className="px-2 text-sm border-2 border-gray-300"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 gap-y-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
              />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No products found.</p>
              <button
                className="mt-4 px-4 py-2 text-white bg-black rounded hover:bg-gray-900"
                onClick={clearFilters}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-center mt-8">
          <button
            disabled={page === 1}
            onClick={handlePrevious}
            className="px-4 py-2 mr-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={handleNext}
            className="px-4 py-2 ml-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Collection;
