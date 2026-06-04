import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Boxes, Hash, PackageCheck, Tags } from 'lucide-react';
import getStock from '../../api/stock.api';
import PaginationController from '../PaginationControls/PaginationController';
import { formatRs } from '../../helpers/formatMoney';

const statusStyles = {
  'in stock': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'low stock': 'border-red-200 bg-red-50 text-red-700',
  'high stock': 'border-blue-200 bg-blue-50 text-blue-700',
};

const statusIcon = (status = '') => {
  const key = String(status).trim().toLowerCase();
  if (key === 'low stock') return <AlertTriangle size={14} />;
  return <PackageCheck size={14} />;
};

const formatNumber = (value) =>
  new Intl.NumberFormat('en-NP', { maximumFractionDigits: 0 }).format(Number(value) || 0);

const InfoPill = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
    {icon}
    {label}
  </span>
);

const StockInformationTable = ({ search = '' }) => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['stock', page, limit, search],
    queryFn: () => getStock(page, limit, search),
    keepPreviousData: false,
    staleTime: 30 * 1000,
  });

  const stocks = useMemo(() => data?.data || [], [data]);
  const totalPage = data?.meta?.totalPages || 1;
  const totalRecords = data?.meta?.totalRecords ?? stocks.length;
  const totalStockValue = useMemo(
    () => stocks.reduce((acc, stock) => acc + Number(stock.stockValue ?? Number(stock.stock) * Number(stock.sellingPrice)), 0),
    [stocks]
  );

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading stock information...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {error?.message || 'Failed to load stock'}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Stock ledger</h3>
          <p className="text-sm text-slate-500">
            {totalRecords} product{totalRecords === 1 ? '' : 's'} tracked
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
          <Boxes size={16} />
          Page value {formatRs(totalStockValue)}
        </div>
      </div>

      {stocks.length === 0 ? (
        <div className="p-8 text-center">
          <p className="font-medium text-slate-700">No stock found</p>
          <p className="mt-1 text-sm text-slate-500">Try a different product name or product ID.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Available</th>
                  <th className="px-4 py-3 text-right">Unit price</th>
                  <th className="px-4 py-3 text-right">Stock value</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stocks.map((stock) => {
                  const statusKey = String(stock.status ?? '').trim().toLowerCase();
                  const badge = statusStyles[statusKey] ?? 'border-slate-200 bg-slate-50 text-slate-600';
                  const stockValue = stock.stockValue ?? Number(stock.stock) * Number(stock.sellingPrice);

                  return (
                    <tr key={stock.productId} className="hover:bg-slate-50/80">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900">{stock.name}</p>
                        <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                          <Hash size={13} />
                          Product #{stock.productId}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-slate-700">{stock.category || '—'}</td>
                      <td className="px-4 py-4 text-right font-semibold text-slate-900">
                        {formatNumber(stock.stock)}
                      </td>
                      <td className="px-4 py-4 text-right text-slate-700">{formatRs(stock.sellingPrice)}</td>
                      <td className="px-4 py-4 text-right font-semibold text-slate-900">{formatRs(stockValue)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${badge}`}>
                          {statusIcon(stock.status)}
                          {stock.status || 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {stocks.map((stock) => {
              const statusKey = String(stock.status ?? '').trim().toLowerCase();
              const badge = statusStyles[statusKey] ?? 'border-slate-200 bg-slate-50 text-slate-600';
              const stockValue = stock.stockValue ?? Number(stock.stock) * Number(stock.sellingPrice);

              return (
                <article key={stock.productId} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{stock.name}</p>
                      <p className="mt-1 text-xs text-slate-500">Product #{stock.productId}</p>
                    </div>
                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${badge}`}>
                      {statusIcon(stock.status)}
                      {stock.status || 'In Stock'}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <InfoPill icon={<Tags size={13} />} label={stock.category || '—'} />
                    <InfoPill icon={<Boxes size={13} />} label={`${formatNumber(stock.stock)} available`} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div>
                      <p className="text-xs text-slate-500">Unit price</p>
                      <p className="mt-1 font-semibold text-slate-900">{formatRs(stock.sellingPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Stock value</p>
                      <p className="mt-1 font-semibold text-emerald-700">{formatRs(stockValue)}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {totalPage > 1 && (
        <div className="border-t border-slate-200 px-4 py-3">
          <PaginationController
            currentPage={page}
            totalPages={totalPage}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default StockInformationTable;
