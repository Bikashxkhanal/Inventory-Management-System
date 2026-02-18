import { DynamicForm} from './../../index'
import { useNavigate } from 'react-router-dom'
import { createStaff } from '../../../api/staff.api'
import useMutate from '../../../hooks/useMutate'



const CreateStaff = () => {
    const navigate = useNavigate();
  
    const handleSubmission = ( data) =>{
        console.log(data);
        mutation.mutate(data);   
        
    }

    const mutation = useMutate(createStaff, {
      onSuccess : () => navigate('/web/staff')
    })


    return  <DynamicForm useCase='createStaff' status={mutation.isPending} title= 'Staff Creation' onSubmit={(data) => handleSubmission( data)}  />
   
    
}


export default CreateStaff; 