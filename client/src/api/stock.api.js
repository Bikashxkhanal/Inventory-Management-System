import api from "./axios";

const getStock = async (page = 1, limit = 10) => {
  
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 ? limit : 10;

  const response = await api.get("/api/stocks", {
    params: {
      page: safePage,
      limit: safeLimit
    }
  });

  return response;
};

export const fetchStockStats = async () => {
        const response = await api.get('/api/stocks/stats');
        return response;
}

export default getStock;
