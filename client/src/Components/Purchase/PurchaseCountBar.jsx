import { SegmentedProgressBar } from './../index';
import { useQuery } from '@tanstack/react-query';
import { fetchPurchaseStats } from '../../api/purchase.api';

const PurchaseCountBar = () => {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['purchase-stats'],
    queryFn: fetchPurchaseStats,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  if (isLoading) return <h1>Loading...</h1>;
  if (isError || !data) return <h1>Error loading purchase stats</h1>;

  const total = data.total;
const datas = [
    { name: 'completed', color: 'green', value: parseInt(data.completed) || 0, total },
    { name: 'draft', color: 'red', value: parseInt(data.draft) || 0, total }
  ];


  return (
    <SegmentedProgressBar
      label="Purchase"
      datas={datas}
    />
  );
};

export default PurchaseCountBar;
