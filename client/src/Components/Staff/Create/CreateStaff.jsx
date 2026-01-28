import { DynamicForm} from './../../index'
import { useMutation } from '@tanstack/react-query'
import { useNavigation } from 'react-router-dom'
import { createStaff } from '../../../api/staff.api'
import useMutate from '../../../hooks/useMutate'



const CreateStaff = () => {
    const navigate = useNavigation();
  
    const handleSubmission = (data) =>{
        console.log(data);
        mutation.mutate(data);   
        
    }

    const mutation = useMutate(createStaff, options = {
      onSuccess : navigate('/staff')
    })


    return  <DynamicForm useCase='createStaff' status={mutation.isPending} title= 'Staff Creation' onSubmit={(data) => handleSubmission(data)}  />
   
    
}


export default CreateStaff; 