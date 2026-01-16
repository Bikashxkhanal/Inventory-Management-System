import {DataTable} from './../index'

const StaffInfoTable = () => {
    const staffData = {
        headers : ["staff Id", "Full Name", "Address", "Joined Date", "Role", "Email"],
        bodyData : [[
            80001, "Bikash Khanal", "Kathmandu", "2025-11-10", "Super Admin", "bikash@gmail.com"
        ],
    [
            80002, "Diya Acharya", "Bhaktapur", "2025-12-10", "Admin", "diya@gmail.com"
        ]]
        
    }

    return <DataTable tableData={staffData} />
}

export default StaffInfoTable;