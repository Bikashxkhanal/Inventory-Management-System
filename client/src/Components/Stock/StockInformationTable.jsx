import { useQuery } from "@tanstack/react-query";
import stockData from "./StockData";
import {
  DataTable,
  ActionComponent
} from "./../index";
import PaginationController from './../Pagination Controls/PaginationController'


import { useEffect, useState } from "react";
// import { tableData } from "./StockData";


const StockInformationTable = () => {
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(null);
  const limit = 5;
  // const [data, setData] = useState(tableData || []);

  const {data, isLoading, isError, error} = useQuery({
    queryKey : ['stock', {page, limit}],
    queryFn : () => stockData(false, page, limit).then(res =>{
      setTotalPage(res.totalPages);
      setPage(res.page)
      return res.data
    })})

  // useEffect (() => {
  //   setData([
  //     ...data, 
  //     tableData
  //   ])
  // }, [tableData]);


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
