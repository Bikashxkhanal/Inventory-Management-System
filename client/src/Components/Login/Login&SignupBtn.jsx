

function LoginSingupBtn({
  Name, ...props

}){
    return(
        <> 
        <button
          className={ `${props} w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700`}>
          {Name}
        </button>
      
      </>
    )
}

export default LoginSingupBtn;