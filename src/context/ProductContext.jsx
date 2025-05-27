import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import useProduct from "../hooks/useProduct";


export const ProductContext = createContext();

const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { fetchProducts: fetchProductsFromHook, fetchProductById } =
    useProduct();

  // Wrap fetchProducts to manage context state
  const fetchProducts = useCallback(
    async (options = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const productsData = await fetchProductsFromHook({
          ...options,
          search,
        });
        setProducts(productsData.products || []);
        setTotalPages(productsData.totalPages || 1);
        setCurrentPage(productsData.page || 1);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        toast.error(err.message || "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProductsFromHook, search]
  );

  // Fetch products on mount
  useEffect(() => {
    fetchProducts({ page: 1 });
  }, [fetchProducts]);

  const value = {
    products,
    setProducts,
    fetchProducts,
    fetchProductById,
    totalPages,
    currentPage,
    isLoading,
    error,
    search,
    setSearch,
    showSearch,
    setShowSearch,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductContextProvider;
