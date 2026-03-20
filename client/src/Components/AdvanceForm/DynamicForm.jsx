import { formConfig } from "./FormConfig";
import { buildSchema } from "./FormSchema";
import {useForm} from 'react-hook-form'
import {zodResolver } from '@hookform/resolvers/zod'
import {InputBox, NewButton} from './../index'
import { useEffect } from "react";


const DynamicForm = ({ useCase,
  title = '',
  status,
  onSubmit,
  dynamicOptions = {},
  dynamicValues = {},
  onFieldChange}) => {

    const fields = formConfig[useCase] || []
    
    const schema = buildSchema(fields)
    const {register, handleSubmit, setValue, watch, setError, clearErrors, formState: {errors}} = useForm({resolver : zodResolver(schema)})


     useEffect(() => {
    Object.entries(dynamicValues).forEach(([key, val]) => {
      setValue(key, val);
    });
  }, [dynamicValues, setValue]);

  const quantity = watch('quantity');
  const unitPrice = watch('unitPrice');
  const stockQty = watch('stock');
  const subTotal  = watch('subTotal');  


  useEffect(() => {
    const qty   = parseFloat(quantity)  || 0;
    const price = parseFloat(unitPrice) || 0;
    console.log(qty, price);
    


    if (qty > 0 && price > 0) {
      setValue('subTotal', (qty * price).toFixed(2));
    }

    // Stock validation
    if (stockQty !== null && qty > stockQty) {
      setError('quantity', {
        type: 'manual',
        message: `Only ${stockQty} units available in stock`
      });
    } else {
      clearErrors('quantity');
    }

  }, [quantity, unitPrice, stockQty, setValue, setError, clearErrors]);

    return (   
        <form  onSubmit={handleSubmit(onSubmit)} className= "mt-15 md:mt-5 flex flex-col justify-start gap-4 mx-5 items-start relative">
            <p className='text-xl bg-transparent md:text-3xl font-semibold md:font-bold '>{title}</p>
             <div className='flex flex-col md:grid md:grid-cols-2 gap-4 w-full '>
            {
                fields?.map((field) => (
                    <div key={field.name}>
                        {
                            field.type === 'text' &&
                             <InputBox placeholder={`Enter ${field.name}`} {...register(field.name)} />

                        }

                            {
                            field.type === 'display' && (
                          <div className="w-full border-2 border-gray-200 bg-gray-200 rounded-sm py-2 px-3 text-sm text-gray-700">
                          {(() => {
                          const watchedValue = watch(field.name);   
                          const displayValue = watchedValue ?? dynamicValues[field.name]; 

                          return displayValue
                            ? <span>{displayValue}</span>
                            : <span className="text-gray-400">No {field.name} selected</span>;
                        })()}


                           
                          <input type="hidden" {...register(field.name)} />
                          </div>
                        )
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
                            field.type === 'date' && (
                              <InputBox
                                type="date" // important for HTML5 date picker
                                placeholder={`Enter ${field.name}`}
                                {...register(field.name)}
                              />
                            )
                          }
                          {
                            field.type === 'select' && 
                            <select
                              {...register(field.name)}
                              onChange={(e) => {
                                register(field.name).onChange(e); // calling react-hook-form handler
                                if(onFieldChange) onFieldChange(field.name, e.target.value); // notify parent
                              }}
                              className="w-full cursor-pointer text-center border-2 border-gray-300 rounded-sm py-2"
                            >
                              <option value="">Select a {field.name}</option>
                              {
                                // Use dynamic options if provided, otherwise fallback to field.options
                                (dynamicOptions?.[field.name] || field.options)?.map(opt => (
                                  <option key={opt.value || opt} value={opt.value || opt}>
                                    {opt.label || opt}
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
                                <p className="text-red-600">{ errors[field.name].message}</p>
                            )
                        }
                       

                    </div>
                ))

            }


            

              <NewButton  className='md:w-50 bg-green-500 hover:bg-green-800 cursor-pointer w-full md:absolute md:right-0 md:top-[110%]' children='Create' loading= {status} />
                </div>
        </form>
      
    )
}

export default DynamicForm;