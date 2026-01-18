import {DataTable, DotsHortlIcon, NewButton} from './../index'
import { useState, useEffect } from 'react'
import ActionComponet from '../Actions/ActionComponet';

const StaffInfoTable = () => {
    const [disabled, setDisabled] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
   

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
    <ActionComponet id={staff.Staffid} />
          
  )
}));

    return <DataTable tableData={staffDataWithActionsBar} />
            
}

export default StaffInfoTable;