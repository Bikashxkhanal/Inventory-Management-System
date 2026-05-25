import { FilterComponent, NewButton } from './../index';
import { useNavigate } from 'react-router-dom';
import { canAddStaff } from '../../helpers/roleAccess';
import { useSelector } from 'react-redux';

const StaffFilterBar = ({ search, onSearchChange, role, onRoleChange, dateRange, onDateChange, onApply }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const roles = ['admin', 'salesperson', 'manager'];

  return (
    <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search by name, email, or phone (live)"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
        <FilterComponent
          type="category"
          label="All roles"
          options={roles.map((r) => ({ value: r, label: r }))}
          catValue={role}
          onChange={onRoleChange}
        />
        <FilterComponent
          type="date-range"
          label="Joined"
          dateValue={dateRange}
          onChange={onDateChange}
        />
        <button
          type="button"
          onClick={onApply}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Apply dates
        </button>
      </div>
      {canAddStaff(user?.role) && (
        <NewButton children="Add staff" onClick={() => navigate('/web/staff/create-staff')} />
      )}
    </div>
  );
};

export default StaffFilterBar;
