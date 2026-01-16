import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
const FilterComponent = ({ 
    type, label, options = [],
     onChange,
    dateValue = [null, null],
    catValue,
    className = ""

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
            className={` py-1 border-2 border-blue-900 
             text-sm text-center caret-transparent cursor-pointer
              rounded-3xl px-0 w-20 md:w-35 md:text-lg md:px-2 text-black
             ${
                 className 
             }
             `}
             onChangeRaw = {(e)=> e.preventDefault()}

            />
        )

    }

    {
        type === 'category' &&  (
            <select value={catValue || ''} 
            onChange={(e) => onChange(e.target.value)
            }
            className={`py-1 text-center outline-none cursor-pointer border-2 border-blue-900  text-[14px] rounded-3xl px-0 w-20 md:w-35 md:text-lg md:px-2 md:py-1
               ${className} `}
            >
               <option value="">{label}</option>
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