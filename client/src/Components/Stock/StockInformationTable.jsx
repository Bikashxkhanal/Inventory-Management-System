import { useQuery } from "@tanstack/react-query";
import getStock from "../../api/stock.api";
import {
  DataTable,
  ActionComponent
} from "./../index";
import PaginationController from '../PaginationControls/PaginationController';
import { useState, useEffect } from "react";


const colorByStock = [
  {
    status :  'in stock' , 
    color : 'bg-green-500'
  }, 
  {
    status :  'low stock' , 
    color : 'bg-red-500'
  },
  {
    status : 'high stock', 
    color : 'bg-yellow-400'
  },

]



//match the stock (in stock , high stock , low stock , and return the stock status and color)
function matchStockStatusForBgColor(stock){
  console.log(stock);
  
  return colorByStock.find((eachStock) => eachStock.status.trim().toLowerCase() === stock?.status.trim().toLowerCase())
}

const StockInformationTable = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['stock', page, limit],
    queryFn: () => getStock(page, limit),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  // console.log("stock Info ", data);
  
  const stocks = data?.data || [];

  
  const totalPage = data?.meta?.totalPages || data?.totalPages || 1;

  
  useEffect(() => {
    if (page > totalPage && totalPage > 0) {
      setPage(totalPage);
    }
  }, [totalPage, page]);

  if (isLoading) return <h1>Loading ...</h1>;
  if (isError) return <h1>{error.message}</h1>;

  const tableWithActionBtn = stocks.map((stock) => {
    const matchedStatus = matchStockStatusForBgColor(stock);
    

   return ({
    ...stock,
    status : matchedStatus ? (
      <p className={`${matchedStatus.color} rounded-lg`}>
          {matchedStatus.status}
      </p>
    ) : " ", 
    Action: <ActionComponent id={stock.productId} />
  })});

  return (
    <div>
      <DataTable tableData={tableWithActionBtn} />
      <PaginationController
        currentPage={page}
        totalPages={totalPage}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default StockInformationTable;