import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {LoginSingupBtn, InputBox} from "../index";
import { registerUser } from "../../Stores/authThunk";

function SuperAdminVerification(){

     const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const { loading,  error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        firstName : "", 
        lastName : "", 
        phoneNumber : "",
        email : "", 
        role : "", 
        password : "",

    });

    const handleChange = (e) => { 
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value,
        });
    }

    useEffect(()=> {
      setFormData((prev)=> ({
        ...prev,
        role: 'superadmin',

      }))

    }, [])

    const validateForm = () => {
        const superAdminInfoVerify = {};
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^(98|97)\d{8}$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if(!formData.firstName.trim() || !formData.lastName.trim()){
            superAdminInfoVerify.name = "Enter name";
        }
        
        if(!formData.email.trim()){
     superAdminInfoVerify.email = "Email is required";
  
    }else if( !emailRegex.test(formData.email)){
     superAdminInfoVerify.email = "Email is invalid";
    }



    if(!formData.phoneNumber.trim()){
    superAdminInfoVerify.phoneNum = "phone number is required"
    }else if(!phonePattern.test(formData.phoneNumber)){
    superAdminInfoVerify.phoneNum = "phone number is invalid"

    }

    // if(formData.role.trim() !== "superadmin"){
    //     superAdminInfoVerify.role = "must be super admin";
    // }

    // if(!passwordPattern.test(formData.password)){
    //     superAdminInfoVerify.password = "must contains all";
    // }
    setErrors(superAdminInfoVerify);
    return Object.keys(superAdminInfoVerify).length === 0;

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!validateForm()){
            return;
        }
        dispatch(registerUser(formData))
    }


    

    return(
        <>
        <div className="flex justify-center items-center min-h-screen bg-gray-50" >
        <div
      className="w-full h-full min-h-screen bg-white px-6 py-10 flex flex-col items-center md:h-auto md:min-h-0 md:max-w-md md:rounded-lg md:shadow-sm"
    >
      <h2 className="font-bold text-xl  md:text-2xl pb-6 text-green-700">
         Beyond Limits
      </h2>

      <p className="font-light text-lg  md:text-xl pb-6 text-green-400">
        Super Admin Information
      </p>
      

      <form  method="POST" onSubmit={handleSubmit}  className="w-full space-y-4">
        {error  && <p className={`text-red-600 text-center`} >{error}</p>}

        <div className="w-full flex flex-row justify-around">
        <InputBox placeholder="Admin First Name" name="firstName" type="text" onChange={handleChange} />
        {errors.name && <p style={{color:"red"}}>{errors.name}</p>}

        <InputBox placeholder="Admin Last Name" name="lastName" type="text" onChange={handleChange} />
        {errors.name && <p style={{color:"red"}}>{errors.name}</p>}

        </div>

        <InputBox placeholder="Enter your mail" name="email" type="text" onChange={handleChange}  />
        {errors.email && <p style={{color:"red"}}>{errors.email}</p>}


        <InputBox  placeholder="Enter phone number" name="phoneNumber" type="text" onChange={handleChange} />
        {errors.phoneNumber && <p className={`text-red-600 `}>{errors.phoneNumber}</p>}

        <InputBox placeholder="Set password" name="password" 
        type="password" onChange={handleChange} />
          {errors.password && <p className={`text-red-600 `}>{errors.password}</p>}


        <LoginSingupBtn 
         disabled = {loading}
          Name={(loading) ? "signing up...": "Sign up"} />
      </form>
    </div>
    </div>
        
        </>
    )
}

export default SuperAdminVerification;