import { useState } from 'react';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { StockFilterBar, StockInformationTable, StockGeneralInfoBar, StockTitle } from './../index';

const StockLayout = () => {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  return (
    <div className="page-content mt-6 flex flex-col gap-6 md:mt-8">
      <StockTitle />
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
