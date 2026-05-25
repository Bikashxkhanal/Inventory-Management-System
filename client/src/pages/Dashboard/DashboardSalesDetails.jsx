import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSalesDetails } from '../../api/sales.api';
import { fetchCategories } from '../../api/product.api';
import { formatRs } from '../../helpers/formatMoney';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import PaginationController from '../../Components/PaginationControls/PaginationController';

const DashboardSalesDetails = () => {
  const [page, setPage] = useState(1);
  const [phone, setPhone] = useState('');
  const debouncedPhone = useDebouncedValue(phone, 400);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [productId, setProductId] = useState('');

  const limit = 8;

  const filters = {
    phone: debouncedPhone.trim() || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    category_id: categoryId || undefined,
    product_id: productId || undefined,
  };

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
  const catList = Array.isArray(categories) ? categories : categories?.data ?? [];

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['sales-details', page, limit, filters],
    queryFn: () => fetchSalesDetails({ page, limit, ...filters }),
    keepPreviousData: true,
  });

  const sales = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;
  const errorMessage = error?.message ?? 'Failed to load sales';

  const applyFilters = () => setPage(1);

  return (
    <div className="page-content mt-6 max-w-6xl pb-10">
      <Link to="/web/dashboard" className="text-sm text-slate-500 hover:text-slate-800">
        ← Dashboard
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold text-slate-900">Sales details</h1>

      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <input
          type="search"
          placeholder="Customer phone (live search)"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setPage(1);
          }}
          className="min-w-[180px] rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
          <option value="">All categories</option>
          {catList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-28 rounded-lg border px-3 py-2 text-sm"
        />
        <button type="button" onClick={applyFilters} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
          Apply date & filters
        </button>
      </div>

      {isLoading && <p className="text-slate-500">Loading…</p>}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-3 font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && sales.length === 0 && (
        <p className="text-slate-500">No sales match your filters.</p>
      )}

      <div className="space-y-4">
        {!isError && sales.map((sale) => (
          <article key={sale.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <p className="font-semibold text-slate-900">Sale #{sale.id}</p>
                <p className="text-xs text-slate-500">
                  {sale.saleDate} · {sale.customerPhone || 'Walk-in'} · {sale.soldBy || '—'}
                </p>
              </div>
              <p className="text-lg font-bold text-emerald-700">{formatRs(sale.totalAmount)}</p>
            </div>
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="py-1">Product</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(sale.items ?? []).map((item, idx) => (
                  <tr key={`${sale.id}-${item.productId}-${idx}`} className="border-t border-slate-50">
                    <td className="py-2">{item.productName}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>{formatRs(item.unitPrice)}</td>
                    <td>{formatRs(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <PaginationController currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default DashboardSalesDetails;
