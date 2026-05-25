import { Link } from "react-router-dom";
import {InputBox, LoginSingupBtn} from "../index.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loginUser } from "../../Stores/authThunk.js";
import { useNavigate } from "react-router-dom";
import { getRememberedLogin } from "../../helpers/auth/rememberMe";

function LoginComponent(){
  const [loginDetail, setLoginDetail] = useState({
    username : "",
    password : "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const saved = getRememberedLogin();
    if (saved?.username) {
      setLoginDetail((prev) => ({ ...prev, username: saved.username }));
      setRememberMe(true);
    }
  }, []);
  

  const {loading, user, error} = useSelector((state)=> state.auth);
 


  const handleChange = (e) => {
    setLoginDetail({
      ...loginDetail,
      [e.target.name] : e.target.value,
    })
  }

  

  const validateForm = () => {


    const loginErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneNbrRegex = /^(98|97)\d{8}$/;


    //userName validation
    
    if(!loginDetail.username.trim()){
      loginErrors.usernameErr = "Name is required";
    }else if(!phoneNbrRegex.test(loginDetail.username) && !emailRegex.test(loginDetail.username)){ 
        loginErrors.usernameErr = "Invalid email or phone number format";
    };

    if(!loginDetail.password.trim()){
      loginErrors.passwordErr = "password is required";
    }

    //password validation
    
    setErrors(loginErrors);
    return Object.keys(loginErrors).length === 0;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    //execute validatation function
    if(!validateForm()){
      return;
    }
    console.log(loginDetail);
    
     dispatch(
      loginUser({
        ...loginDetail,
        rememberMe,
      })
    );
      
  }

  useEffect(()=>{
    if(user?.isAuthenticated && user?.id){
      navigate('/web/dashboard');
    }
  }, [user?.isAuthenticated,user?.id, navigate])

  //Redirect the user to their dashboard if exist

    return(
        <>
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
         <div className="
      w-full h-full min-h-screen bg-white px-6 py-10
      flex flex-col items-center
      md:h-auto md:min-h-0 md:max-w-md md:rounded-lg md:shadow-sm
    ">
      
      <h2 className="font-bold text-xl md:text-2xl pb-6 text-green-700">Welcome to Beyond Limits </h2>

      <form  method="POST"  className="w-full space-y-4" onSubmit={handleSubmit} >

        { error && <p className={`text-center text-red-700`}> {error}</p>}
        <InputBox
          placeholder="Phone number or email"
          name="username"
          type="text"
          value={loginDetail.username}
          onChange={handleChange}
        />
        {errors.usernameErr && <p className={`text-red-600`}>{errors.usernameErr}</p>}

        <InputBox placeholder="password" name="password" type="password"
        onChange={ handleChange}  />
        {errors.passwordErr && <p className={`text-red-600`}>{errors.passwordErr}</p>}

        <div className="flex justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-green-700 focus:ring-green-600"
            />
            <span>Remember me</span>
          </label>

          <Link  className="text-green-700 hover:underline" >Forgot password?</Link>

        </div>

     <LoginSingupBtn disable={loading} Name={(loading) ? "Loging" : "Login" } />
      
      </form>

      <p className="my-4 text-gray-600">OR</p>

      <button
        className="w-full border border-green-600 rounded-md flex items-center justify-center gap-3 py-3 hover:bg-gray-100 transition cursor-pointer">
        <img src="./googleLogo.svg" className="w-6 h-6 " alt="Google Icon" />
        <span className="font-medium">Continue with Google</span>
      </button>

      <p className="text-xs text-center text-gray-600 mt-4 px-4">
        By logging in, you agree to Beyond Limit’s
         Terms of Service,
        Privacy Policy, and
        Intellectual Property Rights
      </p>

      <p className="mt-4 text-gray-700">
        Don’t have an account?
        <Link to="/signup" className="text-green-700 font-medium hover:underline">Sign up</Link>
      </p>

    </div>
    </div>
        </>

    )
}

export default LoginComponent;