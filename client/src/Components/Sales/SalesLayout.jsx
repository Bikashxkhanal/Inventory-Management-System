import { useSelector } from 'react-redux';
import { SalesTable, SalesTitle, NewButton, IconImage, SearchBar, FilterComponent } from './../index';
import { Add } from '../../assets/Imagesender';
import Button from '../Button/Button';

const SalesLayout = () => {
  // Get logged-in user info from Redux store
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || 'guest'; // fallback if not logged in

  return (
    <div className="page-content flex flex-col gap-6 sm:gap-8 md:gap-10">
      <div className="mb-4 flex w-full flex-col gap-4 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between md:mt-0">
        <SalesTitle />

        {/* Only Salesperson can create new sale */}
        {role === 'salesperson' && (
          <NewButton
            as='a'
            href='/web/sale/create'
            children='New Sale'
            className='bg-green-600 hover:bg-green-800'
            iconStart={<IconImage src={Add} />}
          />
        )}
      </div>

        <div className="flex w-full flex-col justify-center gap-3 sm:flex-row sm:gap-5">
         <FilterComponent type='date-range' />
         <NewButton children="Filter" />
        </div>
      

      {/* Pass role to table to control update buttons */}
      <SalesTable  />
    </div>
  );
};

export default SalesLayout;
