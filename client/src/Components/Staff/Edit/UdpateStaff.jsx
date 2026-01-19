import AdvForm from "../../AdvanceForm/AdvForm"


const  UpdateStaff = ({
    id
}) => {
    //Get all the detail of the user or something that matches the id and put to the form 
    const staff = {
        id : null, 
        name : null,
        email : null , 
        address : null, 
        contact : null,
    }

    const InputBoxs = [{
    name : "id",
    type : "number",
    value : staff.id ? staff.id : "",
    prop : 'disabled',
},
        {
    name : "name",
    type : "text",
    placeholder : "Enter Name",
    value : staff.name ? staff.name : ""
},
{
    name : "email",
    type : "email",
    placeholder : "Enter Email",
    value : staff.email ? staff.id : ""
},
{
    name : "address",
    type : "text",
    placeholder : "Enter Address",
    value : staff.address ? staff.address : ""
},
{
    name : "contact",
    type : "tel",
    placeholder : "Enter phnone number",
    value : staff.contact ? staff.contact : ""
},
]

    return <AdvForm  detail = {InputBoxs} />
}


export default UpdateStaff;