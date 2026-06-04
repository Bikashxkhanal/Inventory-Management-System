import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { CalendarDays, PackageCheck, Phone, ReceiptText, UserRound } from 'lucide-react';
import { ActionComponent } from './../index';
import { fetchSales } from '../../api/sales.api';
import { formatRs } from '../../helpers/formatMoney';
import PaginationController from '../PaginationControls/PaginationController';

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return new Intl.DateTimeFormat('en-NP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const statusClass = (status = '') => {
  const normalized = String(status).toLowerCase();
  if (normalized === 'completed') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (normalized === 'cancelled') return 'border-red-200 bg-red-50 text-red-700';
  return 'border-slate-200 bg-slate-50 text-slate-600';
};

const InfoPill = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
    {icon}
    {label}
  </span>
);

const SalesTable = () => {
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role ?? 'guest';

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['sales', page, limit],
    queryFn: () => fetchSales({ page, limit }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  const sales = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalRecords = data?.meta?.totalRecords ?? sales.length;
  const canEdit = userRole === 'storemanager' || userRole === 'manager';

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading sales information...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {error?.message || 'Failed to load sales.'}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Recent sales</h3>
          <p className="text-sm text-slate-500">{totalRecords} sale{totalRecords === 1 ? '' : 's'} recorded</p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
          <ReceiptText size={16} />
          Sales ledger
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="p-8 text-center">
          <p className="font-medium text-slate-700">No sales found</p>
          <p className="mt-1 text-sm text-slate-500">Created sales will appear here with customer and amount details.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Sale</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Sold by</th>
                  <th className="px-4 py-3 text-right">Items</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Status</th>
                  {canEdit && <th className="px-4 py-3 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">#{sale.id}</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                        <CalendarDays size={13} />
                        {formatDate(sale.saleDate)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2 text-slate-700">
                        <Phone size={15} className="text-slate-400" />
                        {sale.customerPhone || 'Walk-in'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2 text-slate-700">
                        <UserRound size={15} className="text-slate-400" />
                        {sale.soldBy || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-slate-700">{sale.itemCount ?? 0}</td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-900">{formatRs(sale.totalAmount)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(sale.status)}`}>
                        {sale.status || 'completed'}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="px-4 py-4 text-right">
                        <ActionComponent id={sale.id} onEdit={() => console.log('Edit Sale', sale.id)} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {sales.map((sale) => (
              <article key={sale.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">Sale #{sale.id}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(sale.saleDate)}</p>
                  </div>
                  <p className="text-lg font-bold text-emerald-700">{formatRs(sale.totalAmount)}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <InfoPill icon={<Phone size={13} />} label={sale.customerPhone || 'Walk-in'} />
                  <InfoPill icon={<UserRound size={13} />} label={sale.soldBy || '—'} />
                  <InfoPill icon={<PackageCheck size={13} />} label={`${sale.itemCount ?? 0} item${Number(sale.itemCount) === 1 ? '' : 's'}`} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(sale.status)}`}>
                    {sale.status || 'completed'}
                  </span>
                  {canEdit && <ActionComponent id={sale.id} onEdit={() => console.log('Edit Sale', sale.id)} />}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="border-t border-slate-200 px-4 py-3">
          <PaginationController
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  );
};

export default SalesTable;
