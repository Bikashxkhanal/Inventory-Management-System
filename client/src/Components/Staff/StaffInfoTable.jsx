import {DataTable, ActionComponent} from './../index'
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import getStaff from './StaffData';
import PaginationController from '../Pagination Controls/PaginationController';

const StaffInfoTable = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null)
  const limit = 5;
  const {data, isLoading, isError}  = useQuery({
    queryKey : ['staff' , {page, limit }],
    queryFn : () => getStaff(false, {page, limit}).then(res => {
      setTotalPage(res.totalPages)
      return res.data
      
    }),
    staleTime : 5 * 60 * 1000,
    cacheTime : 30 * 60 * 1000,
    refetchOnMount : false,

  })

  // useEffect(() => {
  //   setData ([
  //     ...data,
  //     staffData
  //   ])
  // }, [staffData])

  if(isLoading) return <h1>Loading...</h1>

const staffDataWithActionsBar = data?.map((staff) => ({
  ...staff, 
  Action : (
    <ActionComponent id={staff.staffId}  />
          
  )
}));

    return <div>
     <DataTable tableData={staffDataWithActionsBar} />
     <PaginationController currentPage={page} totalPages={totalPage} onPageChange={(page) => setPage(page)} />
     </div>
            
}

export default StaffInfoTable;