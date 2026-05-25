import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { X, Plus } from 'lucide-react';
import { createProduct } from '../../api/product.api';
import { fetchCategories, createCategory } from '../../api/category.api';
import { useToast } from '../../context/ToastContext';
import { isSuperadmin } from '../../helpers/roleAccess';
import { formatRs } from '../../helpers/formatMoney';

const ProductAddModal = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [busy, setBusy] = useState(false);
  const [addingCat, setAddingCat] = useState(false);

  const { data: catList = [], refetch: refetchCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const canCreateCategory = isSuperadmin(user?.role);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setAddingCat(true);
    try {
      const res = await createCategory(newCategoryName.trim());
      showToast(res?.message || 'Category created', 'success');
      setNewCategoryName('');
      await refetchCategories();
      if (res?.data?.id) setCategoryId(String(res.data.id));
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setAddingCat(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!categoryId) {
      showToast('Please select a category', 'error');
      return;
    }
    setBusy(true);
    try {
      const body = await createProduct({
        name: name.trim(),
        category_id: Number(categoryId),
        selling_price: sellingPrice ? Number(sellingPrice) : 0,
      });
      showToast(body?.message || 'Product saved', 'success');
      queryClient.invalidateQueries({ queryKey: ['product-catalog'] });
      onClose();
    } catch (err) {
      showToast(err?.message || 'Failed to add product', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Add product</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="block text-sm">
            <span className="mb-1 font-medium text-slate-700">
              Product name <span className="text-red-500">*</span>
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 font-medium text-slate-700">
              Category <span className="text-red-500">*</span>
            </span>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            >
              <option value="">Select category</option>
              {catList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {catList.length === 0 && (
              <p className="mt-1 text-xs text-amber-700">
                No categories yet.
                {canCreateCategory
                  ? ' Create one below.'
                  : ' Ask superadmin to add a category.'}
              </p>
            )}
          </label>

          {canCreateCategory && (
            <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50/50 p-3">
              <p className="mb-2 text-xs font-medium text-violet-800">New category (superadmin)</p>
              <div className="flex gap-2">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  disabled={addingCat || !newCategoryName.trim()}
                  onClick={handleAddCategory}
                  className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>
          )}

          <label className="block text-sm">
            <span className="mb-1 font-medium text-slate-700">Initial selling price (Rs.)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
            {sellingPrice && (
              <p className="mt-1 text-xs text-slate-500">
                Preview: {formatRs(sellingPrice)}
              </p>
            )}
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !categoryId}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Create product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductAddModal;
