import {DataTable, ActionComponent, staffData} from './../index'

const StaffInfoTable = () => {
    /// these are samplas datas , must be fetched from the db
const staffDataWithActionsBar = staffData.map((staff) => ({
  ...staff, 
  Action : (
    <ActionComponent id={staff.staffId}  />
          
  )
}));

    return <DataTable tableData={staffDataWithActionsBar} />
            
}

export default StaffInfoTable;