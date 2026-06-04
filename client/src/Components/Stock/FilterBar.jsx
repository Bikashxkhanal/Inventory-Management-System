import { Search } from 'lucide-react';

const StockFilterBar = ({ search, onSearchChange }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <label className="mb-2 block text-sm font-medium text-slate-700">Find stock</label>
    <div className="flex max-w-md items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
      <Search size={17} className="text-slate-400" />
    <input
      type="search"
      placeholder="Search by product name or ID…"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
    />
    </div>
  </div>
);

export default StockFilterBar;
