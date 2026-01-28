import { DynamicForm} from './../../index'
import { useMutation } from '@tanstack/react-query'
import { useNavigation } from 'react-router-dom'
import { createStaffAPI } from '../../../services/api'



const CreateStaff = () => {
    const navigate = useNavigation();
    const mutation = useMutation({
        mutationFn : createStaffAPI,
        onSuccess : () => {
            navigate('/staff')
        }
    })

    const handleSubmission = (data) =>{
        console.log(data);
        mutation.mutate(data);   
        
    }


    return  <DynamicForm useCase='createStaff' status={mutation.isPending} title= 'Staff Creation' onSubmit={(data) => handleSubmission(data)}  />
   
    
}


export default CreateStaff; 