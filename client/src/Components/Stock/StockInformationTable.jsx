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
      "product Id": 1001,
      "product name": "Shoes",
      category: "Fashion",
      Quantity: 2000,
      status: "in stock",
    },

    {
      "product Id": 1002,
      "product name": "Tshirt",
      category: "Fashion",
      Quantity: 50,
      status: "out of stock",
    },
  ];

  return <DataTable tableData={tableData} />;
};

export default StockInformationTable;
