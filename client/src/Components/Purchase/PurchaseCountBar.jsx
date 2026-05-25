import { SegmentedProgressBar } from '../index';
import { useQuery } from '@tanstack/react-query';
import { fetchPurchaseStats } from '../../api/purchase.api';

const PurchaseCountBar = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['purchase-stats'],
    queryFn: fetchPurchaseStats,
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="mb-6 h-14 animate-pulse rounded-xl bg-slate-100" />
    );
  }

  if (isError || !data) {
    return null;
  }

  const stats = data?.total != null ? data : data?.data ?? data;
  const total = Number(stats.total) || 0;
  const datas = [
    {
      name: 'Completed',
      color: 'green',
      value: parseInt(stats.completed, 10) || 0,
      total,
    },
    {
      name: 'Pending',
      color: 'yellow',
      value: parseInt(stats.draft, 10) || 0,
      total,
    },
    {
      name: 'Rejected',
      color: 'red',
      value: parseInt(stats.rejected, 10) || 0,
      total,
    },
  ];

  return (
    <div className="mb-6">
      <SegmentedProgressBar label="Purchase overview" datas={datas} />
    </div>
  );
};

export default PurchaseCountBar;
