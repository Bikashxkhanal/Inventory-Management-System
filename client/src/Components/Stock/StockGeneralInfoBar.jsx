import { SegmentedProgressBar } from "./../index";
import { conditionalData } from "./StockData";
import { useEffect, useState } from "react";

const StockGeneralInfoBar = () => {
  const [data, setData] = useState([]);
  useEffect(()=> {
    if(!conditionalData) return;
    setData(conditionalData)

  }, [conditionalData])
  return <SegmentedProgressBar label="Stock" datas={data} />;
};

export default StockGeneralInfoBar;
