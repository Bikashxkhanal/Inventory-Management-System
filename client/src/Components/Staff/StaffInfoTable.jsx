import {DataTable, ActionComponent} from './../index'

const StaffInfoTable = () => {
    /// these are samplas datas , must be fetched from the db
    const staffData = [
      {
        Staffid : 800001, 
        FullName : "Bikash khanal",
        Address : "Kathmandu",
        JoinedDate : "2025-11-10",
        Role : "Super Admin",
        Email : "khanalbikash007@gmail.com",

      },
      {
        Staffid : 800002, 
        FullName : "Diya khanal",
        Address : "Kathmandu",
        JoinedDate : "2025-12-10",
        Role : "Admin",
        Email : "diya@gmail.com",

      }
    ]
const staffDataWithActionsBar = staffData.map((staff) => ({
  ...staff, 
  Action : (
    <ActionComponent id={staff.Staffid}  />
          
  )
}));

    return <DataTable tableData={staffDataWithActionsBar} />
            
}

export default StaffInfoTable;