// SalesTable.jsx
import { DataTable, ActionComponent } from './../index';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSales } from '../../api/sales.api';
import PaginationController from '../PaginationControls/PaginationController';
import { useSelector } from 'react-redux';

const SalesTable = () => {
  const { user } = useSelector((state) => state.auth); // logged-in user
  const userRole = user?.role ?? 'guest';

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['sales', page, limit],
    queryFn: () => fetchSales({ page, limit }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  const sales = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>{error.message}</h1>;

  const salesWithActions = sales.map((sale) => ({
    ...sale,
    Action:
      userRole === 'storemanager' ? (
        <ActionComponent
          id={sale.id}
          onEdit={() => console.log('Edit Sale', sale.id)} // or open UpdateSale modal
        />
      ) : null,
  }));

  return (
    <div>
      <DataTable tableData={salesWithActions} />
      <PaginationController
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default SalesTable;
