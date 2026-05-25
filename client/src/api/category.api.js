import api from './axios';

export const fetchCategories = async () => {
  const body = await api.get('/api/categories');
  return body?.data ?? [];
};

export const createCategory = async (name) => {
  try {
    const body = await api.post('/api/categories', { name });
    if (body?.success === false) {
      throw new Error(body.message || 'Failed to create category');
    }
    return body;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || err?.message || 'Failed to create category'
    );
  }
};
