
import {
  DataTable,
  NewButton,
  ActionComponent
} from "./../index";

const StockInformationTable = () => {

  const tableData = [
    {
      "productId": 1001,
      "product name": "Shoes",
      category: "Fashion",
      Quantity: 2000,
      status: "in stock",
    },

    {
      "productId": 1002,
      "product name": "Tshirt",
      category: "Fashion",
      Quantity: 50,
      status: "out of stock",
    },
  ];

  const tableWithActionBtn = tableData.map((stock) => ({
    ...stock, 
    Action : (
      <ActionComponent id={stock.productId} />
    )
  }))
  
  return <DataTable tableData={tableWithActionBtn} />;
};

export default StockInformationTable;
