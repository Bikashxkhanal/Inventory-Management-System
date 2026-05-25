import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
  fetchProductCatalog,
  deleteProduct,
  approveProduct,
  rejectProduct,
} from '../../api/product.api';
import PaginationController from '../PaginationControls/PaginationController';
import { useToast } from '../../context/ToastContext';
import {
  canManageProducts,
  isSuperadmin,
} from '../../helpers/roleAccess';
import { formatRs } from '../../helpers/formatMoney';
import ProductUpdatePriceModal from './ProductUpdatePriceModal';
import ConfirmDialog from '../Common/ConfirmDialog';

const ProductInfoTable = ({ search }) => {
  const [page, setPage] = useState(1);
  const [priceEdit, setPriceEdit] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const limit = 8;

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['product-catalog', page, limit, search],
    queryFn: () => fetchProductCatalog({ page, limit, search }),
    keepPreviousData: false,
  });

  const rows = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;

  const run = async (fn, msg) => {
    try {
      await fn();
      showToast(msg, 'success');
      queryClient.invalidateQueries({ queryKey: ['product-catalog'] });
    } catch (e) {
      showToast(e?.message || 'Failed', 'error');
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-slate-500">Loading products…</div>;
  }
  if (isError) {
    return <div className="py-8 text-center text-red-600">Failed to load products</div>;
  }

  return (
    <div
      key={`products-${page}-${search}`}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {isFetching && (
        <p className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500">
          Updating…
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Trend</th>
              <th className="px-4 py-3">Price (Rs.)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  No products found
                </td>
              </tr>
            ) : (
              rows.map((p) => {
                const trend = String(p.sellingTrend ?? 'low').toLowerCase();
                const pending =
                  String(p.approvalStatus ?? '').toLowerCase() === 'pending';
                return (
                  <tr
                    key={p.productId}
                    className="border-b border-slate-100 hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3 font-mono text-slate-600">{p.productId}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                    <td className="px-4 py-3 text-slate-600">{p.category}</td>
                    <td className="px-4 py-3 capitalize text-slate-700">{trend}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {formatRs(p.sellingPrice)}
                    </td>
                    <td className="px-4 py-3">
                      {pending ? (
                        <span className="text-amber-700">Pending</span>
                      ) : (
                        <span className="text-slate-500">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {isSuperadmin(user?.role) && (
                          <button
                            type="button"
                            className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                            onClick={() => setPriceEdit(p)}
                          >
                            Edit price
                          </button>
                        )}
                        {isSuperadmin(user?.role) && pending && (
                          <>
                            <button
                              type="button"
                              className="rounded bg-emerald-600 px-2 py-1 text-xs text-white"
                              onClick={() =>
                                run(
                                  () => approveProduct(p.productId),
                                  'Product approved'
                                )
                              }
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="rounded bg-red-600 px-2 py-1 text-xs text-white"
                              onClick={() =>
                                run(
                                  () => rejectProduct(p.productId),
                                  'Product rejected'
                                )
                              }
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {canManageProducts(user?.role) && (
                          <button
                            type="button"
                            className="cursor-pointer rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                            onClick={() => setRemoveTarget(p)}
                          >
                            Remove
                          </button>
                        )}
                        {!canManageProducts(user?.role) &&
                          !(isSuperadmin(user?.role) && pending) && (
                            <span className="text-slate-400">—</span>
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

      {priceEdit && (
        <ProductUpdatePriceModal
          product={priceEdit}
          onClose={() => setPriceEdit(null)}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['product-catalog'] });
          }}
        />
      )}

      <ConfirmDialog
        open={!!removeTarget}
        title="Remove product?"
        message={
          removeTarget
            ? `"${removeTarget.name}" will be hidden from the catalog. You can add it again later if needed.`
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
            await deleteProduct(removeTarget.productId);
            showToast('Product removed from catalog', 'success');
            queryClient.invalidateQueries({ queryKey: ['product-catalog'] });
            setRemoveTarget(null);
          } catch (e) {
            showToast(e?.message || 'Failed to remove product', 'error');
          } finally {
            setRemoveLoading(false);
          }
        }}
      />
    </div>
  );
};

export default ProductInfoTable;
