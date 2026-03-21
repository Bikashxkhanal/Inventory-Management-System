import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { NewButton } from "..";

const ConfirmSalesOverLayUI = ({
  customerNumber,
  onClose,
  onConfirm,
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
    fixed inset-0 bg-black/40 backdrop-blur-sm 
    flex justify-center items-start pt-10 z-50 overflow-auto

    transition-opacity duration-300
    ${show ? "opacity-100" : "opacity-0 pointer-events-none"}
  `}
  onClick={(e) => e.target === e.currentTarget && onClose()}
>
  <div
    className={`
      w-4/5 max-w-[90vh] mb-10 max-h-[90vh] overflow-auto

      bg-white/20 backdrop-blur-lg border border-white/30
      rounded-xl shadow-2xl p-6 text-white

      transform transition-all duration-300 ease-out
      ${show ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"}
    `}
  >
        {/* Company Name */}
        <div className="text-center font-bold text-3xl pt-4">
          {company?.companyName?.toUpperCase()}
        </div>

        {/* Customer */}
        <div className="font-semibold text-lg pt-4">
          Customer : {customerNumber ?? "N/A"}
        </div>

        <h2 className="text-2xl font-bold text-center my-4">
          Billing Summary
        </h2>

        {/* Table */}
        <table className="w-full text-center border border-white/30">
          <thead className="bg-white/20">
            <tr>
              <th className="p-2">SN.</th>
              <th className="p-2">Product</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Price</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {salesItemsList?.map((salesItems, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td className="p-2">{salesItems?.product}</td>
                <td className="p-2">{salesItems?.quantity}</td>
                <td className="p-2">{salesItems?.unitPrice}</td>
                <td className="p-2">{salesItems?.subTotal}</td>
              </tr>
            ))}

            <tr className="border border-white/30">
              <td colSpan="4" className="p-2">
                Grand Total
              </td>
              <td>{grandTotal}</td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex flex-row my-5 justify-between">
          <div className="font-light text-lg">
            Created By : {user.name}
          </div>

          <div className="flex flex-row gap-10">
            <NewButton className="cursor-pointer" onClick={onClose}>Cancel</NewButton>
            <NewButton className="cursor-pointer" onClick={onConfirm}>Confirm</NewButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSalesOverLayUI;