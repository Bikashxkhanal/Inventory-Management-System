import axios from "axios";
import api from "./axios";

export const createPurchase = async (data) => {
  const response = await api.post("/api/purchase", data);
  return response?.data ?? response;
};

export const fetchPurchaseById = async (id) => {
  const response = await api.get("/api/purchase/detail", { params: { id } });
  return response?.data ?? response;
};

export const fetchPurchasesDetailsList = async (params = {}) => {
  const body = await api.get('/api/purchase/details-list', { params });
  if (body?.success === false) {
    throw new Error(body.message || 'Failed to load purchase details');
  }
  return body;
};

export const fetchPurchase = async ({ page, limit, status }) => {
  const params = { page, limit };
  if (status) params.status = status;
  const response = await api.get("/api/purchase", { params });
  return response;
};

export const fetchPurchaseStats = async () => {
  const response = await api.get("/api/purchase/stats");
  return response?.data ?? response;
};

export const addPurchaseItems = async (data) => {
  const response = await api.post("/api/purchase/items", data);
  return response?.data ?? response;
};

export const finalizePurchase = async (purchaseId) => {
  const response = await api.post("/api/purchase/finalize", {
    purchase_id: purchaseId,
  });
  return response?.data ?? response;
};

export const verifyPurchase = async (purchaseId) => {
  const response = await api.post("/api/purchase/verify", {
    purchase_id: purchaseId,
  });
  if (response?.success === false) {
    throw new Error(response.message || "Verify failed");
  }
  return response?.data ?? response;
};

export const rejectPurchase = async (purchaseId, reason = null) => {
  const response = await api.post("/api/purchase/reject", {
    purchase_id: purchaseId,
    reason,
  });
  if (response?.success === false) {
    throw new Error(response.message || "Reject failed");
  }
  const data = response?.data ?? response;
  return { ...data, message: data?.message ?? response?.message };
};

export const updatePurchase = async (data) => {
  const response = await api.put("/api/purchase", data);
  if (response?.success === false) {
    throw new Error(response.message || "Update failed");
  }
  return response?.data ?? response;
};

export const deletePurchase = async (id) => {
  const response = await api.delete("/api/purchase", {
    params: { id },
    data: { id },
  });
  if (response?.success === false) {
    throw new Error(response.message || "Delete failed");
  }
  return response?.data ?? response;
};

export const fetchVendors = async () => {
  const response = await api.get("/api/vendors");
  return response;
};

export const getPurchaseAmountOfDateRange = async (startDate, endDate) => {
  const body = await api.get('/api/purchase/amount', {
    params: { startDate, endDate },
  });
  return Array.isArray(body?.data) ? body.data : [];
};

export const getTotalPurchaseAmountByDateRange = async (startDate, endDate) => {
  const res = await axios.get("/api/purchase/totalAmount", {
    params: { startDate, endDate },
  });
  return res.data;
};
