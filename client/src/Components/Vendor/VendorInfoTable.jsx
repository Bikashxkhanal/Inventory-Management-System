import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
  fetchVendorCatalog,
  deleteVendor,
  approveVendor,
  rejectVendor,
} from '../../api/vendor.api';
import PaginationController from '../PaginationControls/PaginationController';
import { useToast } from '../../context/ToastContext';
import { canManageVendors, isSuperadmin } from '../../helpers/roleAccess';
import ConfirmDialog from '../Common/ConfirmDialog';

const VendorInfoTable = ({ search }) => {
  const [page, setPage] = useState(1);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const limit = 8;

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vendor-catalog', page, limit, search],
    queryFn: () => fetchVendorCatalog({ page, limit, search }),
    keepPreviousData: false,
  });

  const rows = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;

  const run = async (fn, msg) => {
    try {
      await fn();
      showToast(msg, 'success');
      queryClient.invalidateQueries({ queryKey: ['vendor-catalog'] });
    } catch (e) {
      showToast(e?.response?.data?.message || e?.message || 'Failed', 'error');
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-slate-500">Loading vendors…</div>;
  }
  if (isError) {
    return <div className="py-8 text-center text-red-600">Failed to load vendors</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs font-semibold uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Purchase volume</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                  No vendors found
                </td>
              </tr>
            ) : (
              rows.map((v) => {
                const pending = String(v.approvalStatus ?? '').toLowerCase() === 'pending';
                const top = Number(v.isTopSupplier) === 1;
                return (
                  <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono">{v.id}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{v.name}</span>
                      {top && (
                        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                          TOP
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{Number(v.purchaseVolume ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3">{pending ? 'Pending' : 'Active'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {isSuperadmin(user?.role) && pending && (
                          <>
                            <button
                              type="button"
                              className="rounded bg-emerald-600 px-2 py-1 text-xs text-white"
                              onClick={() => run(() => approveVendor(v.id), 'Approved')}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="rounded bg-red-600 px-2 py-1 text-xs text-white"
                              onClick={() => run(() => rejectVendor(v.id), 'Rejected')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {canManageVendors(user?.role) && (
                          <button
                            type="button"
                            className="cursor-pointer rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                            onClick={() => setRemoveTarget(v)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="border-t px-4 py-3">
          <PaginationController
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <ConfirmDialog
        open={!!removeTarget}
        title="Remove vendor?"
        message={
          removeTarget
            ? `"${removeTarget.name}" will be hidden from the vendor list.`
            : ''
        }
        confirmLabel="Remove"
        variant="danger"
        loading={removeLoading}
        onCancel={() => !removeLoading && setRemoveTarget(null)}
        onConfirm={async () => {
          if (!removeTarget) return;
          setRemoveLoading(true);
          try {
            await deleteVendor(removeTarget.id);
            showToast('Vendor removed', 'success');
            queryClient.invalidateQueries({ queryKey: ['vendor-catalog'] });
            setRemoveTarget(null);
          } catch (e) {
            showToast(e?.message || 'Failed to remove vendor', 'error');
          } finally {
            setRemoveLoading(false);
          }
        }}
      />
    </div>
  );
};

export default VendorInfoTable;
