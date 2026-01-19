import { useEffect, useState } from "react";
import { staffData, AdvForm } from "./../../index"
import { useParams } from "react-router-dom"

const  UpdateStaff = () => {
    const {id} = useParams();

   const staffDetail =  staffData.find(stf =>  stf.staffId === Number(id) )
   const [staff, setStaff] = useState({});
   
    //Get all the detail of the user or something that matches the id and put to the form 

    useEffect(()=> {
       if(staffDetail) setStaff(staffDetail);
    } , [staffDetail])

    const InputBoxs = [{
    name : "id",
    type : "number",
    value : staff.staffId? staff.staffId :"",
},
        {
    name : "name",
    type : "text",
    placeholder : "Enter Name",
    value : staff.FullName ? staff.FullName :""
},
{
    name : "email",
    type : "email",
    placeholder : "Enter Email",
    value : staff.Email ? staff.Email:""
},
{
    name : "address",
    type : "text",
    placeholder : "Enter Address",
    value : staff.Address ? staff.Address :""
},
{
    name : "contact",
    type : "tel",
    placeholder : "Enter phnone number",
    value : staff.Contact ? staff.Contact :""
},

    {
    name : "role",
    type : "text",
    placeholder : "Enter Role",
    value : staff.Role ? staff.Role :""
},

]

    return <AdvForm  datas={InputBoxs} title="Update Staff Detail" children="Update" />
}


export default UpdateStaff;