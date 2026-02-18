import { useQuery } from "@tanstack/react-query";
import { SegmentedProgressBar } from "../index";
import { fetchStockStats } from "../../api/stock.api";

const StockGeneralInfoBar = () => {
  // Fetch stock stats from backend
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ["stock-stats"],
    queryFn: fetchStockStats,
    staleTime: 5 * 60 * 1000, // cache 5 min
    cacheTime: 30 * 60 * 1000,
  });

  if (isLoading) return <h1>Loading stock info...</h1>;
  if (isError) return <h1>Error: {error.message}</h1>;

  // Transform backend response to segmented bar format
  const total = stats.total || 0;

const barData = [
  { name: "In Stock", color: "green", value: parseInt(stats.inStock) || 0, total },
  { name: "Out of Stock", color: "red", value: parseInt(stats.outOfStock) || 0, total },
  { name: "High Stock", color: "blue", value: parseInt(stats.highStock) || 0, total },
];


  return <SegmentedProgressBar label="Stock" datas={barData} />;
};

export default StockGeneralInfoBar;
