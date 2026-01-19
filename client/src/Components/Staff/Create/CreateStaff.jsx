import {AdvForm} from './../../index'

const CreateStaff = () => {
    console.log("Staff Creation");
    

const InputBoxs = [{
    name : "name",
    type : "text",
    placeholder : "Enter Name",
},
{
    name : "email",
    type : "email",
    placeholder : "Enter Email",
},
{
    name : "role",
    type : "dropdown",
    placeholder : "Enter Role",
},
{
    name : "address",
    type : "text",
    placeholder : "Enter Address",
},
{
    name : "contact",
    type : "tel",
    placeholder : "Enter phnone number",
},
]
    return <AdvForm datas={InputBoxs} children="Create" title='Staff Creation' />
}


export default CreateStaff; 