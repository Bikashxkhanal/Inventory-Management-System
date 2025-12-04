

function InputBox(
    {name,type,placeholder, onChange, ...props}
){
    return(
        <>
        <input
          className={`${props} pl-4 py-3 outline-none border border-gray-300 rounded-md w-full focus:border-green-600` }
          type={type}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
        />
        </>

    )
}

export default InputBox;