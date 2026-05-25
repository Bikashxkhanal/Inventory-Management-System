import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchPurchase, fetchPurchaseStats } from '../../api/purchase.api';
import PaginationController from '../PaginationControls/PaginationController';
import PurchaseTable from './PurchaseTable';
import { getPurchaseActionFlags } from '../../helpers/purchasePermissions';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'rejected', label: 'Rejected' },
];

const PurchaseInfoTable = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const limit = 8;
  const { user, permissions } = useSelector((state) => state.auth);

  const actionFlags = useMemo(
    () => getPurchaseActionFlags(user, permissions),
    [user, permissions]
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['purchase', page, limit, statusFilter],
    queryFn: () =>
      fetchPurchase({
        page,
        limit,
        status: statusFilter === 'all' ? undefined : statusFilter,
      }),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
  });

  const { data: stats } = useQuery({
    queryKey: ['purchase-stats'],
    queryFn: fetchPurchaseStats,
    staleTime: 60 * 1000,
  });

  const purchaseData = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;

  const handleFilterChange = (id) => {
    setStatusFilter(id);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-20">
        <p className="text-slate-500">Loading purchases…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-red-700">
        {error?.message || 'Failed to load purchases'}
      </div>
    );
  }

  const showRejectedHint =
    statusFilter === 'rejected' &&
    purchaseData.length === 0 &&
    Number(stats?.rejected ?? 0) === 0;

  return (
    <div className="flex flex-col gap-4">
      {showRejectedHint && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          No rejected purchases yet. Run{' '}
          <code className="rounded bg-amber-100 px-1">Backend/migrations/002_add_rejected_status.sql</code>{' '}
          so rejects are kept instead of deleting drafts. Older rejects may not appear in this list.
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-medium text-slate-600">Filter:</span>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => handleFilterChange(f.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              statusFilter === f.id
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <PurchaseTable
        rows={purchaseData}
        actionFlags={actionFlags}
        showActionsColumn={actionFlags.showActionsColumn}
      />

      {totalPages > 1 && (
        <PaginationController
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};

export default PurchaseInfoTable;
