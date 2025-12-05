
import { data } from 'react-router-dom';
import {registerStart, registerSuccess, registerFail, loginStart, loginSucess, loginFail, otpStart, otpSuccess, otpFail} from './authSlice';

import { loginAPI, userregisterAPI } from '../../services/api';


//User resgistration request to PHP
export const registerUser = (formData) => async (dispatch) => {
    try{
        dispatch(registerStart());
        const {response, data} = await userregisterAPI(formData);

        if(!response.ok){
            throw new Error(data.message  || "Registration failed");
        }

        dispatch(registerSuccess(data.user));

    }catch(error){
        dispatch(registerFail(error.message));
    }
};


//User login request to PHP
export const loginUser = (loginData) => async (dispatch) => {
    try {
        dispatch(loginStart());

       const {response, data} = await loginAPI(loginData);

        if(!response.ok){
           throw new Error(data.message || "Failed to login" );
        }

        dispatch(loginSucess(data));


    } catch (error) {
        dispatch(loginFail(error.message));
        
    };

}

