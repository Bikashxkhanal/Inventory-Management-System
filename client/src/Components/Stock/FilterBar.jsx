const StockFilterBar = ({ search, onSearchChange }) => (
  <div className="my-2">
    <input
      type="search"
      placeholder="Search by product name or ID…"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full max-w-md rounded-lg border border-slate-200 px-4 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
    />
  </div>
);

export default StockFilterBar;
