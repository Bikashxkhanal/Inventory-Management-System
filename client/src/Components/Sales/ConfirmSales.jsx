import { useMemo } from "react";
import { useSelector } from "react-redux";
import { NewButton } from "..";
import { Building2, Phone, ReceiptText, UserRound, X } from "lucide-react";
import { formatRs } from "../../helpers/formatMoney";

const ConfirmSalesOverLayUI = ({
  customerNumber,
  onClose,
  onConfirm,
  apiRequest,
  show,
}) => {
  const { company, user } = useSelector((state) => state.auth);
  const salesItemsList = useSelector(
    (state) => state.salesItemsCart.cartSalesItems
  );

  const grandTotal = useMemo(() => {
    return salesItemsList?.reduce(
      (acc, salesItem) => acc + Number(salesItem.subTotal),
      0
    );
  }, [salesItemsList]);

  if (!show) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-slate-900/50 p-4 pt-8 backdrop-blur-sm
        transition-opacity duration-300
        ${show ? "opacity-100" : "pointer-events-none opacity-0"}
      `}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`
          mb-8 w-full max-w-4xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl
          transform transition-all duration-300 ease-out
          ${show ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}
        `}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <ReceiptText size={20} />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Review sale</h2>
              <p className="text-sm text-slate-500">Confirm the customer and item totals before creating the sale.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Close review"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              <Building2 size={15} />
              Company
            </div>
            <p className="font-semibold text-slate-900">{company?.companyName ?? "Company"}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              <Phone size={15} />
              Customer
            </div>
            <p className="font-semibold text-slate-900">{customerNumber || "N/A"}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-emerald-700">
              <UserRound size={15} />
              Created by
            </div>
            <p className="font-semibold text-emerald-900">{user?.name ?? "Current user"}</p>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="hidden grid-cols-[64px_minmax(0,1fr)_120px_140px_140px] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
              <span>SN</span>
              <span>Product</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Price</span>
              <span className="text-right">Total</span>
            </div>
            <div className="divide-y divide-slate-200">
              {salesItemsList?.map((salesItems, idx) => (
                <div
                  key={`${salesItems?.product}-${idx}`}
                  className="grid gap-2 px-4 py-3 text-sm text-slate-700 md:grid-cols-[64px_minmax(0,1fr)_120px_140px_140px] md:items-center"
                >
                  <span className="hidden text-slate-400 md:block">{idx + 1}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 md:truncate">{salesItems?.product}</p>
                    <p className="text-xs text-slate-500 md:hidden">
                      {salesItems?.quantity} qty x {formatRs(salesItems?.unitPrice)}
                    </p>
                  </div>
                  <span className="hidden text-right md:block">{salesItems?.quantity}</span>
                  <span className="hidden text-right md:block">{formatRs(salesItems?.unitPrice)}</span>
                  <span className="font-semibold text-slate-900 md:text-right">{formatRs(salesItems?.subTotal)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-900">Grand total</p>
              <p className="text-xs text-emerald-700">{salesItemsList?.length ?? 0} item{salesItemsList?.length === 1 ? "" : "s"} in this sale</p>
            </div>
            <p className="text-2xl font-bold text-emerald-800">{formatRs(grandTotal)}</p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
          <NewButton
            type="button"
            variant="ghost"
            className="cursor-pointer border border-slate-200 text-slate-700"
            onClick={onClose}
          >
            Back
          </NewButton>
          <NewButton
            type="button"
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700"
            onClick={onConfirm}
            disabled={apiRequest}
            loading={apiRequest}
          >
            Confirm sale
          </NewButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSalesOverLayUI;
