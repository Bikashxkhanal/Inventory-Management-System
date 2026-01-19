import {InputBox, NewButton} from '../index'
import { useState, useEffect } from 'react';

const AdvForm = ({
    
    datas = [],
    title = '',
    children,
}) => {
    const [form, setForm] = useState({});

const handleChange = () => {
    setForm({
            ...form, 
            [e.taget.name] : e.taget.value
        })
}

const handleSubmission = (e) => {
    e.preventDefault();
    if(!handleValidation()) return;
    //send the form to the backend
}
    return <form action="" method="POST" className= "mt-15 md:mt-5 flex flex-col justify-start gap-4 mx-5 items-start relative" onSubmit={handleSubmission}>
        <p className='text-xl bg-transparent md:text-3xl font-semibold md:font-bold '>{title}</p>
        <div className='flex flex-col md:grid md:grid-cols-2 gap-4 w-full '>
        {
            datas?.map(input => <InputBox name={input?.name} type={input?.type} placeholder={input?.placeholder} value={input?.value}  onChange={handleChange}  />)
        }
        </div>

        <NewButton  className='md:w-50 bg-green-500 hover:bg-green-800 cursor-pointer w-full md:absolute md:right-0 md:top-[110%]' children={children} />
        </form>
}

export default AdvForm;