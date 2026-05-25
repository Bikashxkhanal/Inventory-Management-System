import { useState } from 'react';
import { X } from 'lucide-react';
import { updateProductSellingPrice } from '../../api/product.api';
import { useToast } from '../../context/ToastContext';
import { formatRs } from '../../helpers/formatMoney';

const ProductUpdatePriceModal = ({ product, onClose, onSaved }) => {
  const { showToast } = useToast();
  const [price, setPrice] = useState(String(product?.sellingPrice ?? ''));
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updateProductSellingPrice(product.productId, Number(price));
      showToast('Selling price updated', 'success');
      onSaved?.();
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Update selling price</h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <p className="mb-4 text-sm text-slate-600">
          {product?.name} (ID {product?.productId})
        </p>
        <label className="block text-sm">
          <span className="mb-1 font-medium text-slate-700">Price (Rs.)</span>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
          />
          {price && (
            <p className="mt-1 text-xs text-slate-500">{formatRs(price)}</p>
          )}
        </label>
        <p className="mt-2 text-xs text-amber-700">Only superadmin can change selling price.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm text-slate-600">
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductUpdatePriceModal;
