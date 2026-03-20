import api from "./axios";
export const fetchProductsByCategory = async (categoryId) => {
  const response = await api.get('/api/products', {
    params: { category_id: categoryId }
  });
  return response.data;
};


export const searchProducts = async (searchQuery) => {
  const response = await api.get('/api/products/search', {
      params : {query : searchQuery }
  });

  return response?.data;
}


export const fetchAProductDetails = async (productId) => {
  const response = await api.get('/api/product', {
    params : {id :  productId}
  })
  console.log(response?.data);
  
  return response.data;
}