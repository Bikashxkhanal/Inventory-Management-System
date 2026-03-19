import {StaffCountBar, StaffInfoTable, StaffTitle, StaffFilterBar, NewButton, IconImage} from './../index'
import { Add } from '../../assets/Imagesender';

const StaffLayout = () => {
    return <div className='flex flex-col justify-start gap-8 mx-4 mt-8 ' >
        <div className='w-full flex flex-row justify-between mt-15 md:mt-5 mb-4'>
                <StaffTitle />
                <NewButton  as='a' href='/web/staff/create-staff' children='New' className='bg-green-600 hover:bg-green-800' iconStart={<IconImage src={Add} />}/>
        </div>
       
        <StaffFilterBar  />
        <StaffCountBar />
        <StaffInfoTable />
    </div>
}

export default StaffLayout;