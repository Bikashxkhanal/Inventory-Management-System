import { useSelector } from 'react-redux';
import { SalesTable, SalesTitle, NewButton, IconImage } from './../index';
import { Add } from '../../assets/Imagesender';
import { BarChart3 } from 'lucide-react';

const SalesLayout = () => {
  // Get logged-in user info from Redux store
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || 'guest'; // fallback if not logged in

  return (
    <div className="page-content flex flex-col gap-6">
      <div className="flex w-full flex-col gap-4 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <BarChart3 size={22} />
          </span>
          <SalesTitle />
        </div>

        {/* Only Salesperson can create new sale */}
        {role === 'salesperson' && (
          <NewButton
            as='a'
            href='/web/sale/create'
            children='New Sale'
            className='bg-emerald-600 hover:bg-emerald-700'
            iconStart={<IconImage src={Add} />}
          />
        )}
      </div>
      
      {/* Pass role to table to control update buttons */}
      <SalesTable  />
    </div>
  );
};

export default SalesLayout;
