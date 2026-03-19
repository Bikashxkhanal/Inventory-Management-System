
import {SearchBar,  FilterComponent, NewButton} from './../index'
import { useState } from 'react';
const StaffFilterBar = () => {

    const [role, setRole] = useState('')
    const [date, setDate] = useState([null, null]);
    const  roles = ["admin", "salesperson", "manager"];

    return  <div className='max-w-full flex flex-col md:flex-row gap-4 md:mx-15 md:justify-between md:items-center mt-2 flex-1 grow '>

        <SearchBar />
        <FilterComponent type='date-range' label="Role" options={roles}  catValue={role} onChange={setRole} />
      <NewButton children="search"  />
    </div>
}

export default StaffFilterBar;