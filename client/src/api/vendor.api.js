import api from './axios';

export const fetchVendorsList = async () => {
  const res = await api.get('/api/vendors');
  return res;
};

export const fetchVendorCatalog = async ({ page = 1, limit = 10, search } = {}) => {
  const params = { page, limit };
  if (search?.trim()) params.search = search.trim();
  const res = await api.get('/api/vendor/catalog', { params });
  return res;
};

export const createVendor = async (payload) => {
  const res = await api.post('/api/vendor', payload);
  return res;
};

export const updateVendor = async (payload) => {
  const res = await api.put('/api/vendor', payload);
  return res;
};

export const deleteVendor = async (id) => {
  const res = await api.delete('/api/vendor', { params: { id } });
  return res;
};

export const approveVendor = async (id) => {
  const res = await api.post('/api/vendor/approve', { id });
  return res;
};

export const rejectVendor = async (id) => {
  const res = await api.post('/api/vendor/reject', { id });
  return res;
};
