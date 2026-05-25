import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPurchase } from '../../api/purchase.api';
import { fetchSales } from '../../api/sales.api';
import PaginationController from '../PaginationControls/PaginationController';
import DataTable from '../DataTable/DataTable';

const DashboardDetailModal = ({ open, type, onClose }) => {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-detail', type, page, limit],
    queryFn: () =>
      type === 'purchases'
        ? fetchPurchase({ page, limit })
        : fetchSales({ page, limit }),
    enabled: open && !!type,
    keepPreviousData: true,
  });

  if (!open) return null;

  const rows = data?.data ?? [];
  const totalPages =
    data?.meta?.total_pages ?? data?.meta?.totalPages ?? 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {type === 'purchases' ? 'Purchases' : 'Sales'} — details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
        <div className="overflow-auto p-4">
          {isLoading && <p className="py-8 text-center text-slate-500">Loading…</p>}
          {isError && (
            <p className="py-8 text-center text-red-600">Could not load records.</p>
          )}
          {!isLoading && !isError && (
            <>
              <DataTable tableData={rows} />
              {totalPages > 1 && (
                <PaginationController
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardDetailModal;
