import axios from "axios";
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
  // console.log(response);
  
  return response; 
};

//get the purchase of each date on total of that date , between the provided range
export const getPurchaseAmountOfDateRange = async(startDate , endDate) => {

  const response = await api.get('/api/purchase/amount', {
   params :   {
      startDate , 
      endDate
     }
  });

  return response?.data;
  // console.log(response);
  
}

//get the total purchase between provided purchase range
export const getTotalPurchaseAmountByDateRange = async(startDate , endDate) => {
  // console.log(startDate, endDate);
  
  const res = await axios.get('/api/purchase/totalAmount', {
  params :  {
   startDate : startDate,
   endDate : endDate
  }
  });
  // console.log(res.data);
  return res.data;
}
