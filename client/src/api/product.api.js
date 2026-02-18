import api from "./axios";
export const fetchProductsByCategory = async (categoryId) => {
  const response = await api.get('/api/products', {
    params: { category_id: categoryId }
  });
  return response.data;
};
