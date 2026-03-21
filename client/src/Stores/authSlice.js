import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

//register the business , login into system , OTP verification 

const initialState = {
    authStatus : 'idle', // idle, loading, authenticated , unauthenticated , signup_in_progress , user_verification_in_progress, 
        //  opt_verifying , user_verified
  company : {
    companyId : null,
    companyName: null,
    companyEmail : null,
    companyNumber : null,
  }, 
    user: {
        id : null,
        name : null,
        role : null,
        email : null, 
        isAuthenticated : false,
        isAuthorized : false,
    },
    permissions : [],
    token : null,
    loading: false,
    error : null,
    isOtpVerified: false,
    status : null,
    message : null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers : {

        registerCompanyStart: (state) => {
            state.loading = true;
        },

        registerCompanySuccess : (state, action) => {
            state.loading = false;
            state.company = action.payload;
            state.authStatus = 'signup_in_progress'
        },
        
        registerCompanyFail : (state, action) => {
            state.loading =false;
            state.error = action.payload;
        },
        registerUserStart: (state) => {
            state.loading = true;
        },

        registerUserSuccess : (state, action) => {
            state.loading =false;
            state.user = action.payload;
            state.user.isAuthorized = 'authorized';
           
        },

        registerUserFail : (state, action)=> {
            state.loading = false;
            state.error = action.payload;
            state.status = 'unauthorized'
             state.user.isAuthorized = 'unauthorized';
        },

        loginStart: (state)=>{
            state.loading = true;
            state.authStatus = 'loading'
           
        },

        loginSucess : (state, action)=>{
            state.loading = false;
            state.user = action.payload?.[0]?.user;
            state.company = action.payload?.[0]?.company;
            state.isOtpVerified = action.payload?.[0]?.user.isAuthenticated;
            state.permissions = action.payload?.[0]?.permissions
            state.authStatus = 'authenticated'
        },

        loginFail : (state, action)=>{
            state.loading = false;
            state.error = action.payload;
            console.log(action.payload);
            state.status = 'unauthorized'
            state.authStatus = 'unauthenticated'
        },

        otpStart : (state)=>{
            state.loading = true;
        },
        otpSuccess : (state)=>{
            state.loading = false;
            state.isOtpVerified = true;
        },
        otpFail : (state, action) => {
            state.loading = false;
            state.isOtpVerified = false;
            state.error = action.payload;
        },

        getUserMeStart: (state) => {
            state.loading = true;
            state.authStatus = 'loading';

        },

        getUserMeFail : (state , action) => {
            state.authStatus = 'unauthenticated'
            state.loading = false;
            
            state.user.isAuthorized  = 'unauthorized'
        },

        getMyInfoSuccess : (state, action )=> {
            state.authStatus = 'authenticated'  
            state.loading = false;
            state.user = action.payload?.[0]?.user;
            state.company = action.payload?.[0]?.company;
            state.isOtpVerified = action.payload?.[0]?.user.isAuthenticated;
             state.permissions = action.payload?.[0]?.permissions
            console.log(action.payload);
            
        },

        logoutSuccess : (state, action) => {
            state.message = action.payload;

        },

        logoutFail : (state, action) => {
            state.error = action.payload.message;
            
        }

    }

})

export const {registerUserStart, registerUserSuccess,isOtpVerified, registerUserFail,
    registerCompanyStart, registerCompanySuccess, registerCompanyFail, loginStart, loginSucess, loginFail, otpStart, otpSuccess, otpFail, getUserMeFail, getUserMeStart , getMyInfoSuccess ,logoutSuccess, logoutFail}  = authSlice.actions;

export default authSlice.reducer;