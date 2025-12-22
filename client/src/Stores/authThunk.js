

import {registerUserStart, registerUserSuccess, registerUserFail,
    registerCompanyStart, registerCompanySuccess, registerCompanyFail,
    loginStart, loginSucess, loginFail, otpStart, otpSuccess, otpFail} from './authSlice';

import { loginAPI, userregisterAPI, EmailOtpVerificationAPI , companyregisterAPI } from '../services/api';


//User resgistration request to PHP
export const registerCompany = (formData) => async (dispatch) => {
    try{
        dispatch(registerCompanyStart());
        const {response, data} = await companyregisterAPI(formData);

        if(!response.ok){
            throw new Error(data.message  || "Registration failed");
        }

        if(!data.success){
            throw new Error(data.message || "Registration Failed");
        }


        dispatch(registerCompanySuccess(data.company));

    }catch(error){
        dispatch(registerCompanyFail(error.message));
    }
};

    //company registration call to php using API
export const  registerUser = (formData) => async(dispatch) => {
    try{
        dispatch(registerUserStart());
        const {response, data } = await userregisterAPI(formData);

        
        if(!response.ok){
            throw new Error(data.message  || "Registration failed");
        }

        if(!data.success){
            throw new Error(data.message || "Registration Failed");
        }

        dispatch(registerUserSuccess(data.user));
    }catch(error){
        dispatch(registerUserFail(error.message));

    }
}


//User login request to PHP
export const loginUser = (loginData) => async (dispatch) => {
    try {
        dispatch(loginStart());

       const {response, data} = await loginAPI(loginData);

        if(!response.ok){
           throw new Error(data.message || "Failed to login" );
        }

        if(!data.success){
            throw new Error(data.message || "Login failed");
        }


        dispatch(loginSucess(data));


    } catch (error) {
        dispatch(loginFail(error.message));
       

        
    };

}


//OTP verification 

export const emailOtp = (emailOtp) => async (dispatch) => {
    try{
        dispatch(otpStart());
       const {response, data} = await EmailOtpVerificationAPI(emailOtp);
       if(!response.ok){
        throw new Error(data.message || "Otp verification failed");
       }
       if(!data.success){
        throw new Error(data.message || "Wrong OTP");

       }

       dispatch(otpSuccess());

    }catch(error){

        dispatch(otpFail(error.message));
        
        
      
        

    }
}

