import api from "./axios";
export const createPurchase = async (data) => {
  const response = await api.post("/api/purchase", data);
  return response;
};

// Fetch Purchase (paginated)
export const fetchPurchase = async ({ page, limit }) => {
  const response = await api.get("/api/purchase", {
    params: { page, limit },
  });
  return response;
};

export const fetchPurchaseStats = async() => {
  const response = await api.get('/api/purchase/stats');
  return response;
}

export const addPurchaseItems = async (data) => {
  const response = await api.post('/api/purchase/items', data);
  return response.data;
};

export const fetchProducts = async() => {}


export const fetchVendors = async () => {
  const response = await api.get('/api/vendors'); 
  console.log(response);
  
  return response; 
};
