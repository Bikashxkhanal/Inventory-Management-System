import {DataTable, ActionComponent, staffData} from './../index'
import { useState, useEffect } from 'react';

const StaffInfoTable = () => {
  const [data, setData] = useState(staffData || []);

  useEffect(() => {
    setData (
      ...data,
      staffData
    )
  }, [staffData])
    /// these are samplas datas , must be fetched from the db
const staffDataWithActionsBar = data.map((staff) => ({
  ...staff, 
  Action : (
    <ActionComponent id={staff.staffId}  />
          
  )
}));

    return <DataTable tableData={staffDataWithActionsBar} />
            
}

export default StaffInfoTable;