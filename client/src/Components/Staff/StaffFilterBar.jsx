
import {SearchBar,  FilterComponent} from './../index'
import { useState } from 'react';
const StaffFilterBar = () => {

    const [role, setRole] = useState('')
    const [date, setDate] = useState([null, null]);
    const  roles = ["admin", "salesperson", "manager"];

    return  <div className='max-w-full flex flex-col md:flex-row gap-4 md:gap-0 mt-2 flex-1 grow '>
        <SearchBar />
        <div  className='flex flex-row justify-start items-center gap-2'>
            <p className='text-[16px] font-medium text-center '>Filter By</p>
        <FilterComponent type='date-range' label="Joined Date" dateValue={date} onChange={setDate} />
        <FilterComponent type='category' label="Role" options={roles}  catValue={role} onChange={setRole} />
        </div>
    </div>
}

export default StaffFilterBar;