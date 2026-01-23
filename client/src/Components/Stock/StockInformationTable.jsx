import { useQuery } from "@tanstack/react-query";
import { useMutation, QueryClient } from "@tanstack/react-query";
import stockData from "./StockData";
import {
  DataTable,
  ActionComponent
} from "./../index";
import PaginationController from './../Pagination Controls/PaginationController'


import { useState } from "react";
// import { tableData } from "./StockData";


const StockInformationTable = () => {
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(null);
  const limit = 5;
  // const [data, setData] = useState(tableData || []);

  const {data, isLoading, isError, error} = useQuery({
    queryKey : ['stock', {page, limit}],
    //testing function
    queryFn : () => stockData(false, page, limit).then(res =>{
      setTotalPage(res.totalPages);
      return res.data
    }),
    staleTime :5*60*1000 ,
    cacheTime : 30*60*1000,
    refetchOnMount : false,

  })



    if(isLoading) return <h1>Loading ...</h1>
  
  const tableWithActionBtn = data?.map((stock) => ({
    ...stock, 
    Action : (
      <ActionComponent id={stock.productId} />
    )
  }))

  if(isError) return <h1>{ error.message} </h1>;
  
  
  return <div>
    <DataTable tableData={tableWithActionBtn} />
    <PaginationController currentPage={page} totalPages={totalPage} onPageChange = {(page) => setPage(page)} />
  </div>
   ;
};

export default StockInformationTable;
