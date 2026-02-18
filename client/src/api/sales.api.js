
import api from "./axios";
export const updateSale = async () => {
  const response = await api.put('/api/sales');
  return response;
};

export const createSale = async () => {
  const response = await api.post('/api/sales');
  return response;
};
export const fetchSales = async () => {
  const response = await api.get('/api/sales');
  return response;
};