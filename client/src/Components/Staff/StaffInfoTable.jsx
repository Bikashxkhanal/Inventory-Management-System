import { DataTable, ActionComponent } from './../index'
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStaff } from '../../api/staff.api';
import PaginationController from '../Pagination Controls/PaginationController';

const StaffInfoTable = () => {

  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['staff', page, limit],
    queryFn: () => fetchStaff({ page, limit }),
    keepPreviousData: true, // smooth pagination
    staleTime: 5 * 60 * 1000,
  });

  // Extract safely
  const staffData = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error loading staff</h1>;

  const staffDataWithActionsBar = staffData.map((staff) => ({
    ...staff,
    Action: <ActionComponent id={staff.id} />
  }));

  return (
    <div>
      <DataTable tableData={staffDataWithActionsBar} />
      <PaginationController
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default StaffInfoTable;
