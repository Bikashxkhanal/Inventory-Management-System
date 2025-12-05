
import { Link } from "react-router-dom";
import {InputBox, LoginSingupBtn} from '../index';
import {useSelector, useDispatch} from 'react-redux';
import { useState } from "react";
import { registerUser } from "../Stores/authThunk";

function SignupComponent(){

  const [formData, setFormData] = useState({
    businessName: "",
    businessMail : "",
    phoneNumber : "",

  });

  const [errors, setErrors] = useState({});

  const {user, loading, error} = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleChange = (e) => { 
    setFormData({
      ...formData,
      [e.target.name] : e.target.value,
    });
  }

const validateForm =() => { 
 const signupError = {};
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 const phonePattern = /^(98|97)\d{8}$/;
 if(!formData.businessName.trim()){
  signupError.name = "Name is required";
 }

 if(!formData.businessMail.trim()){
  signupError.email = "Email is required";
  
 }else if( !emailRegex.test(formData.businessMail)){
  signupError.email = "Email is invalid";
 }



  if(!formData.phoneNumber.trim()){
  signupError.phoneNum = "phone number is required"
 }else if(!phonePattern.test(formData.phoneNumber)){
 signupError.phoneNum = "phone number is invalid"

 }
  setErrors(signupError);
 return Object.keys(signupError).length === 0;
}


  const handleSubmit = (e) => {
    e.preventDefault();
   if(!validateForm()){
    return;
   }
   dispatch(registerUser(formData));
  }



    return(
        <>
        <div className="flex justify-center items-center min-h-screen bg-gray-50" >
        <div
      className="w-full h-full min-h-screen bg-white px-6 py-10 flex flex-col items-center md:h-auto md:min-h-0 md:max-w-md md:rounded-lg md:shadow-sm"
    >
      <h2 className="font-bold text-xl  md:text-2xl pb-6 text-green-700">
        Register with Beyond Limits
      </h2>

      <form  method="POST" onSubmit={handleSubmit}  className="w-full space-y-4">
{error  && <p className={`text-red-600 text-center`} >Failed to register </p>}
        {user && <p className={`text-green-600 text-center`} >Registration successfull</p>}
        <InputBox placeholder="Enter business name" name="businessName" type="text" onChange={handleChange} />
        {errors.name && <p style={{color:"red"}}>{errors.name}</p>}

        <InputBox placeholder="Enter business mail" name="businessMail" type="text" onChange={handleChange}  />
        {errors.email && <p style={{color:"red"}}>{errors.email}</p>}

        <InputBox  placeholder="Enter phone number" name="phoneNumber" type="text" onChange={handleChange} />
        {errors.phoneNum && <p className={`text-red-600 `}>{errors.phoneNum}</p>}

        <LoginSingupBtn 
         disabled = {loading}
          Name={(loading) ? "submitting...": "Create New Account"} />
      </form>

      <p className="my-4 text-gray-600">OR</p>

      <button
        className="w-full border border-green-600 rounded-md flex items-center justify-center gap-3 py-3 hover:bg-gray-100 transition"
      >
        <img src="./googleLogo.svg" className="w-6 h-6" alt="Google Icon" />
        <span className="font-medium">Continue with Google</span>
      </button>

      <p className="text-xs text-center text-gray-600 mt-4 px-4">
        By signing up, you agree to Beyond Limit’s
        <Link to="#" className="text-green-700 hover:underline"> Terms of Service</Link>,
        <Link to="#" className="text-green-700 hover:underline"> Privacy Policy</Link>,
        and
        <Link to="#" className="text-green-700 hover:underline">
          Intellectual Property Rights</Link>.
      </p>

      <p className="mt-4 text-gray-700">
        Already have an account?
        <Link to="/login" className="text-green-700 font-medium hover:underline"
          >Sign in</Link>
      </p>
    </div>
    </div>
        
        </>
    )
}


export default SignupComponent;