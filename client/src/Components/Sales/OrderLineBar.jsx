import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { NewButton } from "..";
import {clearAllSalesItems} from '../../Stores/cartSlice';
import { formatRs } from "../../helpers/formatMoney";
import { ShoppingCart, Trash2 } from "lucide-react";


const OrderLineBar = ({
  salesItemsList = [], 
  handlePageNavigation
}) => {
   const dispatch = useDispatch();
    
  const amount = useMemo(() => {
    return salesItemsList.reduce(
      (acc, item) => acc + Number(item?.subTotal),
      0
    );
  }, [salesItemsList]);
  const handleSellsItemsClearance = () => {
    if (!window.confirm("Clear all sale items?")) return;
    dispatch(clearAllSalesItems());
  }

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white shadow-sm xl:sticky xl:top-4">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <ShoppingCart size={18} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Order summary</h3>
            <p className="text-xs text-slate-500">{salesItemsList.length} item{salesItemsList.length === 1 ? '' : 's'} added</p>
          </div>
        </div>
      </div>

      <div className="max-h-[420px] overflow-auto p-4">
        {salesItemsList.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">No items added yet</p>
            <p className="mt-1 text-xs text-slate-500">Selected products will appear here for review.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {salesItemsList.map((orderItem, index) => (
              <div
                key={`${orderItem?.product}-${index}`}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{orderItem?.product}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {orderItem?.quantity} qty x {formatRs(orderItem?.unitPrice)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-slate-900">
                    {formatRs(orderItem?.subTotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-slate-500">Total amount</span>
          <span className="text-xl font-bold text-emerald-700">{formatRs(amount)}</span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
          <NewButton
            type="button"
            variant="ghost"
            size="md"
            className="w-full cursor-pointer border border-slate-200 text-slate-700"
            onClick={handleSellsItemsClearance}
            disabled={salesItemsList.length === 0}
            iconStart={<Trash2 size={16} />}
          >
            Clear all
          </NewButton>
          <NewButton
            type="button"
            className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700"
            size="md"
            onClick={handlePageNavigation}
            disabled={salesItemsList.length === 0}
          >
            Continue
          </NewButton>
        </div>
      </div>
    </div>
  );
};

export default OrderLineBar;
