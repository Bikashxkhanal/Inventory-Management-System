import { useState } from 'react';
import { createVendor } from '../../api/vendor.api';
import { useToast } from '../../context/ToastContext';
import { useQueryClient } from '@tanstack/react-query';

const VendorAddModal = ({ onClose }) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await createVendor({ name });
      const body = res?.data ?? res;
      showToast(body?.message || 'Vendor saved', 'success');
      queryClient.invalidateQueries({ queryKey: ['vendor-catalog'] });
      onClose();
    } catch (err) {
      showToast(err?.message || 'Failed to add vendor', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-slate-900">Add vendor</h2>
        <input
          required
          placeholder="Vendor name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-600">
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorAddModal;
