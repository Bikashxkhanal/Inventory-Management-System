import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { NewButton } from "..";
import {clearAllSalesItems} from '../../Stores/cartSlice';


const OrderLineBar = ({
  salesItemsList = [], 
  handlePageNavigation
}) => {
   const dispatch = useDispatch();
   const [grandTotal, setGrandTotal] = useState(0);
  
  
  
    
  const amount = useMemo(() => {
    return salesItemsList.reduce(
      (acc, item) => acc + Number(item?.subTotal),
      0
    );
  }, [salesItemsList]);

  console.log(amount);
  

  useMemo(() => setGrandTotal(Number(amount)), [amount]);

  const handleSellsItemsClearance = () => {
    alert("Are you sure");
    dispatch(clearAllSalesItems());
  }

  return (
    <div className="mt-20 w-full rounded-lg border border-gray-200 bg-gray-200 px-4 py-4">
      {/* Items container */}
      {salesItemsList.map((orderItem, index) => (
        <div
          key={index}
          className=" py-2 bg-yellow-400 border border-yellow-600 rounded-sm mb-4 flex flex-row justify-around"
        >
          <span>{orderItem?.product}</span>
          <span>{orderItem?.quantity + ' qty'}</span>
          <span>{"Rs." + orderItem?.unitPrice}</span>
          <span>{'Rs.' + orderItem?.subTotal}</span>
        </div>
      ))}

      {/* Show total amount */}
      <div className="w-full  py-2 pl-10 mb-4 pr-2 flex flex-col justify-end items-end gap-4">
        <p className="text-lg  font-semibold">Total Amount Rs.{grandTotal} </p>
        <div className="flex flex-row flex-start gap-5">
        <NewButton children="Clear All" size="lg" className="text-bold cursor-pointer"  onClick={handleSellsItemsClearance} />
        <NewButton className="cursor-pointer" size="lg" onClick={handlePageNavigation} >Next</NewButton> 
        </div>
      </div>
    </div>
  );
};

export default OrderLineBar;