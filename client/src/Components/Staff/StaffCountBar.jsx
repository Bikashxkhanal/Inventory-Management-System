import { SegmentedProgressBar } from './../index';
import { useQuery } from '@tanstack/react-query';
import { fetchStaffStats } from '../../api/staff.api';

const StaffCountBar = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['staff-stats'],
    queryFn: fetchStaffStats,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  if (isLoading) return <h1>Loading...</h1>;
  if (isError || !data) return <h1>Error loading stats</h1>;

  const total = data.total;

  const datas = [
    { name: 'admin', color: 'red', value: data.admin, total },
    { name: 'sales staff', color: 'green', value: data.sales, total },
    { name: 'manager', color: 'blue', value: data.manager, total }
  ];

  return <SegmentedProgressBar label="Staff" datas={datas} />;
};

export default StaffCountBar;
