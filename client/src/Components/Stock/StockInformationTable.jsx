import { useQuery } from "@tanstack/react-query";
import getStock from "../../api/stock.api";
import {
  DataTable,
  ActionComponent
} from "./../index";
import PaginationController from './../Pagination Controls/PaginationController';
import { useState, useEffect } from "react";

const StockInformationTable = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['stock', page, limit],
    queryFn: () => getStock(page, limit),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  const stocks = data?.data || [];
  const totalPage = data?.meta?.totalPages || data?.totalPages || 1;

  // ✅ ALWAYS call hooks before return
  useEffect(() => {
    if (page > totalPage && totalPage > 0) {
      setPage(totalPage);
    }
  }, [totalPage, page]);

  if (isLoading) return <h1>Loading ...</h1>;
  if (isError) return <h1>{error.message}</h1>;

  const tableWithActionBtn = stocks.map((stock) => ({
    ...stock,
    Action: <ActionComponent id={stock.productId} />
  }));

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