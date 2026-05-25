/** Normalize role/permission strings from session (handles SUPERADMIN, Super Admin, etc.). */
export const normalizeKey = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/_/g, '');

export const hasPermission = (permissions, ...needles) => {
  const perms = (permissions ?? []).map((p) => normalizeKey(p));
  return needles.some((needle) =>
    perms.some((p) => p.includes(normalizeKey(needle)))
  );
};

export const getPurchaseActionFlags = (user, permissions) => {
  const role = normalizeKey(user?.role);
  const isAdmin = role === 'admin' || role === 'superadmin';

  const canEdit =
    hasPermission(permissions, 'update_purchase', 'UPDATE_PURCHASE') || isAdmin;
  const canDelete =
    hasPermission(permissions, 'delete_purchase', 'DELETE_PURCHASE') || isAdmin;
  const canVerify =
    hasPermission(permissions, 'verify_purchase', 'VERIFY_PURCHASE') || isAdmin;

  const showActionsColumn = canEdit || canDelete || canVerify;

  return { canEdit, canDelete, canVerify, showActionsColumn, role };
};

export const canActOnPurchaseRow = (flags, status) => {
  const isDraft = String(status ?? 'draft').toLowerCase() === 'draft';
  if (!isDraft) {
    return { showActions: false };
  }
  return {
    showActions:
      flags.canVerify || flags.canEdit || flags.canDelete,
  };
};
