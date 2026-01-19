

function InputBox(
    {name,type,placeholder, onChange, className , ...props}
){
    return(
        <>
        <input
          className={` pl-4 py-3 outline-none border border-gray-300 rounded-md w-full focus:border-green-600 ${className}` }
          type={type}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          {...props}
          
        />
        </>

    )
}

export default InputBox;