import api from './axios';

const apiError = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

export const fetchProductCatalog = async ({ page = 1, limit = 10, search } = {}) => {
  const params = { page, limit };
  if (search?.trim()) params.search = search.trim();
  const res = await api.get('/api/product/catalog', { params });
  return res;
};

export const createProduct = async (payload) => {
  try {
    const body = await api.post('/api/product', payload);
    if (body?.success === false) {
      throw new Error(body.message || 'Create failed');
    }
    return body;
  } catch (err) {
    throw new Error(apiError(err, 'Create failed'));
  }
};

export const updateProductSellingPrice = async (productId, sellingPrice) => {
  try {
    const body = await api.put('/api/product/selling-price', {
      product_id: productId,
      selling_price: sellingPrice,
    });
    if (body?.success === false) {
      throw new Error(body.message || 'Update failed');
    }
    return body;
  } catch (err) {
    throw new Error(apiError(err, 'Update failed'));
  }
};

export const updateProduct = async (payload) => {
  const res = await api.put('/api/product', payload);
  return res;
};

export const deleteProduct = async (id) => {
  try {
    const body = await api.delete('/api/product', { params: { id } });
    if (body?.success === false) {
      throw new Error(body.message || 'Delete failed');
    }
    return body;
  } catch (err) {
    throw new Error(apiError(err, 'Delete failed'));
  }
};

export const approveProduct = async (id) => {
  const res = await api.post('/api/product/approve', { id });
  return res;
};

export const rejectProduct = async (id) => {
  const res = await api.post('/api/product/reject', { id });
  return res;
};

export const fetchProductsByCategory = async (categoryId) => {
  const res = await api.get('/api/products', { params: { category_id: categoryId } });
  return res?.data ?? res;
};

export const fetchCategories = async () => {
  const res = await api.get('/api/categories');
  return res?.data ?? res;
};

export const searchProducts = async (query) => {
  const res = await api.get('/api/products/search', { params: { query } });
  return res?.data ?? res;
};

export const fetchAProductDetails = async (id) => {
  const res = await api.get('/api/product', { params: { id } });
  return res?.data ?? res;
};
