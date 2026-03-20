import { useEffect, useMemo, useState } from "react";


const OrderLineBar = ({ orderItems = [] }) => {
    const [grandTotal, setGrandTotal] = useState(0);

  const amount = useMemo(() => {
    return orderItems.reduce(
      (acc, item) => acc + Number(item?.subTotal),
      0
    );
  }, [orderItems]);

  console.log(amount);
  

  useEffect(() => {
    setGrandTotal(() => Number(amount));
  }, [amount]);
  

  return (
    <div className="w-[97%] mx-6  mt-20 bg-gray-200 ">
      {/* Items container */}
      {orderItems.map((orderItem, index) => (
        <div
          key={index}
          className=" py-2 bg-yellow-400 border border-yellow-600 rounded-sm mb-4 flex flex-row justify-around"
        >
          <span>{orderItem?.product}</span>
          <span>{orderItem?.quantity}</span>
          <span>{orderItem?.unitPrice}</span>
          <span>{orderItem?.subTotal}</span>
        </div>
      ))}

      {/* Show total amount */}
      <div className="w-full  py-2 mb-4 pr-15 flex flex-row-reverse ">
        Total Amount {grandTotal}
      </div>
    </div>
  );
};

export default OrderLineBar;