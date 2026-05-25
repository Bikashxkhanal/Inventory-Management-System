import { useState } from 'react';
import { useSelector } from 'react-redux';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import ProductInfoTable from './ProductInfoTable';
import ProductAddModal from './ProductAddModal';
import { canAddProduct } from '../../helpers/roleAccess';

const ProductLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="page-content mt-6 flex flex-col gap-6 md:mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500">
            Inventory catalog with category and selling trend (last 30 days).
          </p>
        </div>
        {canAddProduct(user?.role) && (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            Add product
          </button>
        )}
      </div>
      <input
        type="search"
        placeholder="Search products…"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="max-w-md rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
      />
      <ProductInfoTable search={debouncedSearch} />
      {showAdd && <ProductAddModal onClose={() => setShowAdd(false)} />}
    </div>
  );
};

export default ProductLayout;
