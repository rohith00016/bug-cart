import { useCallback } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

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

      const response = await axiosInstance.get(`/product?${queryParams}`);

      return {
        products: response.data.products,
        totalPages: response.data.totalPages,
        page: response.data.page,
      };
    } catch (err) {
      throw new Error(
        err.response?.data?.message || err.message || "Failed to fetch products"
      );
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    try {
      const response = await axiosInstance.get(`/product/${id}`);
      return response.data;
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to fetch product"
      );
      return null;
    }
  }, []);

  return { fetchProducts, fetchProductById };
};

export default useProduct;
