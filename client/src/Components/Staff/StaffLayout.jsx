import { useState, useEffect } from 'react';
import { StaffCountBar, StaffInfoTable, StaffTitle, StaffFilterBar } from './../index';
import { formatDate } from '../../helpers/date/date';
import useDebouncedValue from '../../hooks/useDebouncedValue';

const StaffLayout = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [role, setRole] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [applied, setApplied] = useState({});

  useEffect(() => {
    setApplied((prev) => ({
      ...prev,
      q: debouncedSearch.trim() || undefined,
      role: role || undefined,
    }));
  }, [debouncedSearch, role]);

  const applyFilters = () => {
    setApplied((prev) => ({
      ...prev,
      join_from: dateRange[0] ? formatDate(new Date(dateRange[0])) : undefined,
      join_to: dateRange[1] ? formatDate(new Date(dateRange[1])) : undefined,
    }));
  };

  return (
    <div className="page-content mt-6 flex flex-col gap-6 md:mt-8">
      <StaffTitle />
      <StaffFilterBar
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        dateRange={dateRange}
        onDateChange={setDateRange}
        onApply={applyFilters}
      />
      <StaffCountBar />
      <StaffInfoTable filters={applied} />
    </div>
  );
};

export default StaffLayout;
