// PurchaseInfoTable.jsx

import { DataTable, ActionComponent } from './../index'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPurchase } from '../../api/purchase.api';
import PaginationController from '../Pagination Controls/PaginationController';
import { useNavigate } from 'react-router-dom';


const PurchaseInfoTable = () => {

  const [page, setPage] = useState(1);
  const limit = 5;
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['purchase', page, limit],
    queryFn: () => fetchPurchase({ page, limit }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  const purchaseData = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error loading purchase</h1>;

  const purchaseWithActions = purchaseData.map((purchase) => ({
    ...purchase,
    Action: <ActionComponent id={purchase.id} />
  }));

  return (
    <div>

      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <button onClick={() => navigate('/web/purchase/create')}>
        </button>
      </div>

      <DataTable tableData={purchaseWithActions} />

      <PaginationController
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default PurchaseInfoTable;
