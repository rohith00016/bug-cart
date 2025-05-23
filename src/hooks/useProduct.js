import { useCallback } from "react";
import { toast } from "react-toastify";

const useProduct = () => {
  const fetchProducts = useCallback(async (options = {}) => {
    const {
      page = 1,
      sort = "",
      category = "",
      type = "",
      search = "",
    } = options;

    try {
      const queryParams = new URLSearchParams({
        page,
        sort,
        search,
        category,
        type,
      }).toString();

      const response = await fetch(
        `http://localhost:8000/api/product?${queryParams}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      return {
        products: data.products,
        totalPages: data.totalPages,
        page: data.page,
      };
    } catch (err) {
      throw new Error(err.message || "Failed to fetch products");
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/product/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch product");
      }

      return data;
    } catch (err) {
      toast.error(err.message || "Failed to fetch product");
      return null;
    }
  }, []);

  return { fetchProducts, fetchProductById };
};

export default useProduct;
