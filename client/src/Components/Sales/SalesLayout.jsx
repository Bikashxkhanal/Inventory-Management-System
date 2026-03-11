import { useSelector } from 'react-redux';
import { SalesTable, SalesTitle, NewButton, IconImage } from './../index';
import { Add } from '../../assets/Imagesender';

const SalesLayout = () => {
  // Get logged-in user info from Redux store
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || 'guest'; // fallback if not logged in

  return (
    <div className='flex-1 mx-4 mt-8'>
      <div className='w-full flex flex-row justify-between mt-15 md:mt-5 mb-4'>
        <SalesTitle />

        {/* Only Salesperson can create new sale */}
        {role === 'salesperson' && (
          <NewButton
            as='a'
            href='/web/sales/create'
            children='New Sale'
            className='bg-green-600 hover:bg-green-800'
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
