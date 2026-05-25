import { useState } from 'react';
import { useSelector } from 'react-redux';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import VendorInfoTable from './VendorInfoTable';
import VendorAddModal from './VendorAddModal';
import { canAddVendor } from '../../helpers/roleAccess';

const VendorLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="page-content mt-6 flex flex-col gap-6 md:mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendors</h1>
          <p className="text-sm text-slate-500">
            Suppliers ranked by purchase volume. Top suppliers are highlighted.
          </p>
        </div>
        {canAddVendor(user?.role) && (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add vendor
          </button>
        )}
      </div>
      <input
        type="search"
        placeholder="Search vendors…"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="max-w-md rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
      />
      <VendorInfoTable search={debouncedSearch} />
      {showAdd && <VendorAddModal onClose={() => setShowAdd(false)} />}
    </div>
  );
};

export default VendorLayout;
