import api from './axios';

const apiError = (err, fallback) =>
  err?.message || err?.response?.data?.message || fallback;

export const createStaff = async (payload) => {
  const body = await api.post('/api/staff/create', payload);
  if (body?.success === false) {
    throw new Error(body.message || 'Create failed');
  }
  return body;
};

export const fetchStaff = async ({
  page = 1,
  limit = 10,
  q,
  role,
  join_from,
  join_to,
} = {}) => {
  const params = { page, limit };
  if (q) params.q = q;
  if (role) params.role = role;
  if (join_from) params.join_from = join_from;
  if (join_to) params.join_to = join_to;

  const body = await api.get('/api/staff', { params });
  if (body?.success === false) {
    throw new Error(body.message || 'Failed to load staff');
  }
  // API: { success, data: { data: [...], meta: {} } }
  return body.data ?? { data: [], meta: {} };
};

export const fetchStaffStats = async () => {
  const body = await api.get('/api/staff/stats');
  return body?.data ?? body;
};

export const softDeleteStaff = async (id) => {
  const body = await api.delete('/api/staff', { params: { id } });
  if (body?.success === false) throw new Error(body.message);
  return body;
};

export const approveStaff = async (id) => {
  const body = await api.post('/api/staff/approve', { id });
  if (body?.success === false) throw new Error(body.message);
  return body;
};

export const rejectStaff = async (id) => {
  const body = await api.post('/api/staff/reject', { id });
  if (body?.success === false) throw new Error(body.message);
  return body;
};

export const fetchStaffById = async (id) => {
  const body = await api.get('/api/staff/detail', { params: { id } });
  if (body?.success === false) {
    throw new Error(body.message || 'Failed to load staff');
  }
  return body.data;
};

export const updateStaff = async (id, payload) => {
  try {
    const body = await api.put('/api/staff', { id: Number(id), ...payload });
    if (body?.success === false) {
      throw new Error(body.message || 'Update failed');
    }
    return body;
  } catch (err) {
    throw new Error(apiError(err, 'Update failed'));
  }
};
