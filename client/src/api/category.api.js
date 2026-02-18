import api from "./axios";
export const fetchCategories = async () => {
  const response = await api.get('/api/categories');
  return response;
};
