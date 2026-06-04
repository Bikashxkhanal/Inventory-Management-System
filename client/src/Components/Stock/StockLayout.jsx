import { useState } from 'react';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { StockFilterBar, StockInformationTable, StockGeneralInfoBar, StockTitle } from './../index';
import { Warehouse } from 'lucide-react';

const StockLayout = () => {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  return (
    <div className="page-content mt-6 flex flex-col gap-6 md:mt-8">
      <div className="flex w-full flex-col gap-4 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Warehouse size={22} />
          </span>
          <StockTitle />
        </div>
      </div>
      <StockGeneralInfoBar />
      <StockFilterBar
        search={searchInput}
        onSearchChange={setSearchInput}
      />
      <StockInformationTable search={debouncedSearch} />
    </div>
  );
};

export default StockLayout;
