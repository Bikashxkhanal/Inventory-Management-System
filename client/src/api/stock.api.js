import api from "./axios";

const getStock = async (page = 1, limit = 10, search = '') => {
  
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 ? limit : 10;

  const params = { page: safePage, limit: safeLimit };
  if (search?.trim()) params.search = search.trim();

  const response = await api.get("/api/stocks", { params });

  return response;
};

export const fetchStockStats = async () => {
        const response = await api.get('/api/stocks/stats');
        return response;
}

export default getStock;
