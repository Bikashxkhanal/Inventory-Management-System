import ActionComponet from "../Actions/ActionComponet";
import {
  ActionComponents,
  DataTable,
  DotsHortlIcon,
  NewButton,
} from "./../index";
import { useState } from "react";

const StockInformationTable = () => {
  const [disabled, setDisabled] = useState(false);

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

  const tableWithActionBtn = ({
    ...tableData, 
    Action : (tableData.map(table => <ActionComponet id={table.productId} />)
        
    )
  })

  return <DataTable tableData={tableWithActionBtn} />;
};

export default StockInformationTable;
