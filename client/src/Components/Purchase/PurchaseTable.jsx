import PurchaseStatusBadge from './PurchaseStatusBadge';
import PurchaseActionsMenu from './PurchaseActionsMenu';

const formatMoney = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(2) : '0.00';
};

const formatDate = (value) => {
  if (!value) return '—';
  return String(value).split(' ')[0].split('T')[0];
};

const PurchaseTable = ({
  rows = [],
  actionFlags,
  showActionsColumn = false,
}) => {
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
        <p className="text-base font-medium text-slate-600">No purchases found</p>
        <p className="mt-1 text-sm text-slate-500">
          Try another filter or create a new purchase.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-800 text-white">
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Vendor</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold text-right">Total</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              {showActionsColumn && (
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((purchase) => {
              const isDraft = String(purchase.status).toLowerCase() === 'draft';
              const showRowActions =
                showActionsColumn &&
                isDraft &&
                (actionFlags.canVerify ||
                  actionFlags.canEdit ||
                  actionFlags.canDelete);

              return (
                <tr
                  key={purchase.id}
                  className="transition-colors hover:bg-slate-50/80"
                >
                  <td className="px-4 py-3 font-mono text-slate-600">
                    #{purchase.id}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {purchase.vendor}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(purchase.purchase_date)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">
                    {formatMoney(purchase.total_amount)}
                  </td>
                  <td className="px-4 py-3">
                    <PurchaseStatusBadge status={purchase.status} />
                  </td>
                  {showActionsColumn && (
                    <td className="px-4 py-3 text-right">
                      {showRowActions ? (
                        <PurchaseActionsMenu
                          id={purchase.id}
                          status={purchase.status}
                          vendor={purchase.vendor}
                          totalAmount={purchase.total_amount}
                          canEdit={actionFlags.canEdit}
                          canDelete={actionFlags.canDelete}
                          canVerify={actionFlags.canVerify}
                        />
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseTable;
