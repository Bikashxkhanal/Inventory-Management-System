import { formConfig } from "./FormConfig";
import { buildSchema } from "./FormSchema";
import {useForm} from 'react-hook-form'
import {zodResolver } from '@hookform/resolvers/zod'
import {InputBox, NewButton} from './../index'
import { useEffect } from "react";



const DynamicForm = ({
  useCase,
  title = '',
  submitLabel = 'Create',
  status,
  onSubmit,
  dynamicOptions = {},
  dynamicValues = {},
  onFieldChange}) => {

    const fields = formConfig[useCase] || []
    
    const schema = buildSchema(fields)
    const {register, handleSubmit, setValue, watch, setError, clearErrors,reset, formState: {errors}} = useForm({resolver : zodResolver(schema)})


     useEffect(() => {
    Object.entries(dynamicValues).forEach(([key, val]) => {
      setValue(key, val);
    });
  }, [dynamicValues, setValue]);

  const quantity = watch('quantity');
  const unitPrice = watch('unitPrice');
  const stockQty = watch('stock');


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

  const onSubmitHandler = (data) => {
      onSubmit(data);
      reset();
      
  }

    return (   
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="mt-5 flex w-full max-w-2xl flex-col items-start justify-start gap-4"
        >
            {title && <p className='text-base bg-transparent font-semibold text-slate-900'>{title}</p>}
             <div className='flex w-full flex-col gap-4 md:grid md:grid-cols-2'>
            {
                fields?.map((field) => (
                    <div key={field.name}>
                        {
                            field.type === 'text' &&
                             <InputBox placeholder={`Enter ${field.name}`} {...register(field.name)} />

                        }

                            {
                            field.type === 'display' && (
                          <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
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
                              className="w-full cursor-pointer rounded-md border border-slate-300 py-3 text-center text-sm text-slate-700 outline-none focus:border-green-600"
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
                                <p className="mt-1 text-sm text-red-600">{ errors[field.name].message}</p>
                            )
                        }
                       

                    </div>
                ))

            }


            

              <div className="md:col-span-2 flex w-full justify-end">
                <NewButton
                  type="submit"
                  className='w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 md:w-auto'
                  loading={status}
                >
                  {submitLabel}
                </NewButton>
              </div>
                </div>
        </form>
      
    )
}

export default DynamicForm;
