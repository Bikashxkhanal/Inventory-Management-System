import { useQuery } from '@tanstack/react-query';
import getStock from '../../api/stock.api';
import DataTable from '../DataTable/DataTable';
import PaginationController from '../PaginationControls/PaginationController';
import { useState, useEffect } from 'react';

const statusStyles = {
  'in stock': 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  'low stock': 'bg-red-100 text-red-800 ring-red-200',
  'high stock': 'bg-amber-100 text-amber-900 ring-amber-200',
};

const StockInformationTable = ({ search = '' }) => {
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['stock', page, limit, search],
    queryFn: () => getStock(page, limit, search),
    keepPreviousData: false,
    staleTime: 30 * 1000,
  });

  const stocks = data?.data || [];
  const totalPage = data?.meta?.totalPages || 1;

  useEffect(() => {
    if (page > totalPage && totalPage > 0) setPage(totalPage);
  }, [totalPage, page]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-slate-500">
        Loading stock…
      </div>
    );
  }
  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 py-8 text-center text-red-700">
        {error?.message || 'Failed to load stock'}
      </div>
    );
  }

  const rows = stocks.map((stock) => {
    const key = String(stock.status ?? '').trim().toLowerCase();
    const badge = statusStyles[key] ?? 'bg-slate-100 text-slate-700 ring-slate-200';
    return {
      productId: stock.productId,
      name: stock.name,
      category: stock.category ?? '—',
      stock: stock.stock,
      sellingPrice: stock.sellingPrice,
      status: (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badge}`}>
          {stock.status}
        </span>
      ),
    };
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <DataTable tableData={rows} />
      {totalPage > 1 && (
        <div className="border-t border-slate-100 px-4 py-3">
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
