import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPurchasesDetailsList } from '../../api/purchase.api';
import { fetchVendorsList } from '../../api/vendor.api';
import { fetchCategories } from '../../api/product.api';
import { formatRs } from '../../helpers/formatMoney';
import PaginationController from '../../Components/PaginationControls/PaginationController';

const DashboardPurchasesDetails = () => {
  const [page, setPage] = useState(1);
  const [vendorId, setVendorId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [status, setStatus] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [productId, setProductId] = useState('');
  const [applied, setApplied] = useState({});
  const limit = 8;

  const { data: vendorsRes } = useQuery({
    queryKey: ['vendors-simple'],
    queryFn: fetchVendorsList,
  });
  const vendors = Array.isArray(vendorsRes) ? vendorsRes : vendorsRes?.data ?? [];

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
  const catList = Array.isArray(categories) ? categories : categories?.data ?? [];

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['purchase-details', page, limit, applied],
    queryFn: () =>
      fetchPurchasesDetailsList({
        page,
        limit,
        vendor_id: applied.vendor_id,
        date_from: applied.date_from,
        date_to: applied.date_to,
        status: applied.status,
        category_id: applied.category_id,
        product_id: applied.product_id,
      }),
    keepPreviousData: true,
  });

  const purchases = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;
  const errorMessage = error?.message ?? 'Failed to load purchases';

  const applyFilters = () => {
    setPage(1);
    setApplied({
      vendor_id: vendorId || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      status: status || undefined,
      category_id: categoryId || undefined,
      product_id: productId || undefined,
    });
  };

  return (
    <div className="page-content mt-6 max-w-6xl pb-10">
      <Link to="/web/dashboard" className="text-sm text-slate-500 hover:text-slate-800">
        ← Dashboard
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold text-slate-900">Purchase details</h1>

      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <select
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">All vendors</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
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
          Apply filters
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

      {!isLoading && !isError && purchases.length === 0 && (
        <p className="text-slate-500">No purchases match your filters.</p>
      )}

      <div className="space-y-4">
        {!isError && purchases.map((p) => (
          <article key={p.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <p className="font-semibold text-slate-900">
                  Purchase #{p.id} · {p.vendor}
                </p>
                <p className="text-xs text-slate-500">
                  {p.purchaseDate} · <span className="capitalize">{p.status}</span>
                </p>
              </div>
              <p className="text-lg font-bold text-blue-700">{formatRs(p.totalAmount)}</p>
            </div>
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="py-1">Product</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Line total</th>
                </tr>
              </thead>
              <tbody>
                {(p.items ?? []).map((item, idx) => (
                  <tr key={`${p.id}-${idx}`} className="border-t border-slate-50">
                    <td className="py-2">{item.productName}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>{formatRs(item.unitPrice)}</td>
                    <td>{formatRs(item.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <PaginationController
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardPurchasesDetails;
