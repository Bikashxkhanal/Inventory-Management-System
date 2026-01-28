import { formConfig } from "./FormConfig";
import { buildSchema } from "./FormSchema";
import {useForm} from 'react-hook-form'
import {zodResolver } from '@hookform/resolvers/zod'
import {InputBox, NewButton} from './../index'


const DynamicForm = ({useCase, onSubmit}) => {
    const fields = formConfig[useCase] || []
    const schema = buildSchema(fields)
    const {register, handleSubmit, formState: {errors}} = useForm({resolver : zodResolver(schema)})

    return (
        <form  onSubmit={handleSubmit(onSubmit)} className=" mx-5 my-20 grid grid-cols-2 gap-4">
            {
                fields?.map((field) => (
                    <div key={field.name}>
                        {
                            field.type === 'text' &&
                             <InputBox placeholder={`Enter ${field.name}`} {...register(field.name)} />
                        }
                        {
                            field.type === 'email' && 
                            <InputBox placeholder={`Enter ${field.name}`} {...register(field.name)} />
                        }
                        {
                            field.type === 'number' && (
                                <InputBox type='number' placeholder={`Enter ${field.name} `} {...register(field.name, {valueAsNumber : true})} />
                            )
                        }
                        {
                            field.type === 'tel' && 
                            <InputBox placeholder={`Enter ${field.name}`} {...register(field.name)} />      
                        }
                        {
                            field.type === 'select' && 
                            <select {...register(field.name)}  className="px-15 py-1 border border-black  " >
                                {
                                    field.otions?.map((opt) => (
                                        <option value={opt} key={opt}>
                                            {opt}
                                        </option>
                                    ))
                                }

                            </select>

                        }

                        {
                            field.type === 'checkbox' && 
                            <input type='checkbox' placeholder={`Enter ${field.name}`} {...register(field.name)} />
                        }

                        {
                            errors[field.name] && (
                                <p>{ errors[field.name].message}</p>
                            )
                        }
                       

                    </div>
                ))

            }

            <NewButton children="Create" size="md" className="bg-green-600 cursor-pointer  hover:bg-green-900" />
        </form>
    )
}

export default DynamicForm;