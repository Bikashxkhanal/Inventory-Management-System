import {StaffCountBar, StaffInfoTable, StaffTitle, StaffFilterBar} from './../index'

const StaffLayout = () => {
    return <div className='flex-1 mx-4 mt-8 ' >
        <StaffTitle />
        <StaffCountBar />
        <StaffFilterBar />
        <StaffInfoTable />
    </div>
}

export default StaffLayout;