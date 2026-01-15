import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
const FilterComponent = ({ 
    type, label, options = [],
     onChange,
    dateValue = [null, null],
    catValue,

}) => {
    const [start, end] = dateValue;
    return <div>
    {
        type === 'date-range' &&   (
            <DatePicker
            selectsRange 
            startDate={start }
            endDate={end }
            onChange={onChange}
            placeholderText={label}
            isClearable
            className=' px-2 py-1 pr-5 border-2 border-blue-900 
             rounded-sm text-lg text-center caret-transparent cursor-pointer'
             onChangeRaw = {(e)=> e.preventDefault()}

            />
        )

    }

    {
        type === 'category' &&  (
            <select value={catValue || ''} 
            onChange={(e) => onChange(e.target.value)
            }
            className='h-10 w-50 box-border px-4  text-center outline-none cursor-pointer border-2 border-gray-600 rounded-sm text-lg'
            >
               <option value="">--Select {label}--</option>
               {
                options?.map((opt) => {
                    return <option  key={opt} value={opt}>
                        {opt}
                        </option>
                })
               }
            </select>
        )
    }
    </div>
}

export default FilterComponent;