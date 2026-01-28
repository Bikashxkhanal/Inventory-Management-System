import {AdvForm, DynamicForm} from './../../index'
import { useMutation, useQueryClient } from '@tanstack/react-query'


const CreateStaff = () => {
    const handleSubmission = (data) =>{
        console.log(data);
        
    }
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
    return <div>
        <AdvForm fields={InputBoxs} children="Create" title='Staff Creation' />
        <DynamicForm useCase='createStaff' onSubmit={(data) => handleSubmission(data)} />
    </div> 
    
}


export default CreateStaff; 