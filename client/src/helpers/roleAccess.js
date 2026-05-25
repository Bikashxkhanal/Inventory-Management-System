export const normalizeRole = (role) =>
  String(role ?? '')
    .toLowerCase()
    .replace(/[\s_-]+/g, '');

export const isSalesperson = (role) => normalizeRole(role) === 'salesperson';

export const canManageStaff = (role) =>
  ['superadmin', 'admin', 'manager'].includes(normalizeRole(role));

export const canDeleteStaff = (role) => normalizeRole(role) === 'superadmin';

export const canAddStaff = (role) => canManageStaff(role) && !isSalesperson(role);

export const canManageProducts = (role) =>
  ['superadmin', 'admin'].includes(normalizeRole(role));

export const canAddProduct = (role) =>
  ['superadmin', 'admin', 'manager'].includes(normalizeRole(role));

export const canManageVendors = (role) => canManageProducts(role);

export const canAddVendor = (role) => canAddProduct(role);

export const isSuperadmin = (role) => normalizeRole(role) === 'superadmin';
