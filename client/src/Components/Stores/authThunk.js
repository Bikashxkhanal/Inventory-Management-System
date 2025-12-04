
import {registerStart, registerSuccess, registerFail, loginStart, loginSucess, loginFail, otpStart, otpSuccess, otpFail} from './authSlice';

export const registerUser = (formData) => async (dispatch) => {
    try{
        dispatch(registerStart());

        const response = await fetch("https://example.com/api/register", {
            method : "POST",
            headers : {
                "Content-Type": "application/json",
            },
            body : JSON.stringify(formData),
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message  || "Registration failed");
        }

        dispatch(registerSuccess(data.user));

    }catch(error){
        dispatch(registerFail(data.message));

    }
};


