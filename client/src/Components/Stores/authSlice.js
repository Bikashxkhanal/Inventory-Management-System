import { createSlice } from "@reduxjs/toolkit";

//register the business , login into system , OTP verification 

const initialState = {
    user: null,
    token : null,
    loading: false,
    error : null,
    isAuthenticated : false,
    otpVerificed: false,

}

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers : {
        registerStart: (state) => {
            state.loading = true;
        },

        registerSuccess : (state, action) => {
            state.loading =false;
            state.user = action.payload;
        },

        registerFail : (state, action)=> {
            state.loading = false;
            state.error = action.payload;
        },

        loginStart: (state)=>{
            state.loading = true;
        },

        loginSucess : (state, action)=>{
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },

        loginFail : (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        otpStart : (state)=>{
            state.loading = true;
        },
        otpSuccess : (state)=>{
            state.loading = false;
            state.otpVerificed = true;
        },
        otpFail : (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload;
        },
    }

})

export const {registerStart, registerSuccess, registerFail, loginStart, loginSucess, loginFail, otpStart, otpSuccess, otpFail}  = authSlice.actions;

export default authSlice.reducer;