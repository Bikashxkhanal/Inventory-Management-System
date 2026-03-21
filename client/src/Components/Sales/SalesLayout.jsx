import { useSelector } from 'react-redux';
import { SalesTable, SalesTitle, NewButton, IconImage, SearchBar, FilterComponent } from './../index';
import { Add } from '../../assets/Imagesender';
import Button from '../Button/Button';

const SalesLayout = () => {
  // Get logged-in user info from Redux store
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || 'guest'; // fallback if not logged in

  return (
    <div className='flex flex-col px-4 gap-10'>
      <div className='w-full flex flex-row justify-between 
      mt-15 md:mt-0  mb-4 pt-8 pb-4 px-4 border-b border-white rounded-lg bg-white 
      shadow-sm'>
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

        <div className='w-full flex flex-row justify-center gap-5'>
         <FilterComponent type='date-range' />
         <NewButton children="Filter" />
        </div>
      

      {/* Pass role to table to control update buttons */}
      <SalesTable  />
    </div>
  );
};

export default SalesLayout;
