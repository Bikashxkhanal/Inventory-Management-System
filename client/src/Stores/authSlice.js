import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

//register the business , login into system , OTP verification 

const initialState = {
        authStatus : 'idle', // idle, loading, authenticated , unauthenticated
  
    user: {
         companyId : null,
        companyName: null,
        user_id : null,
        user_name : null,
        user_role : null,
    },
    permissions : [],
    token : null,
    loading: false,
    error : null,
    isAuthenticated : false,
    isOtpVerified: false,
    status : null,
    isAuthorized: null,
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
            state.isAuthenticated = true
            state.isAuthorized = 'authorized';
           
        },

        registerUserFail : (state, action)=> {
            state.loading = false;
            state.error = action.payload;
            state.status = 'unauthorized'
             state.isAuthorized = 'unauthorized';
        },

        loginStart: (state)=>{
            state.loading = true;
            state.authStatus = 'loading'
           
        },

        loginSucess : (state, action)=>{
            state.loading = false;
            state.user = action.payload.user.identity;
            state.isAuthenticated = action.payload.user.isAuthenticated;
            state.isAuthorized = action.payload.isAuthorized
            state.isOtpVerified = action.payload.user.isAuthenticated;
            state.permissions = action.payload.user.permissions
            state.authStatus = 'authenticated'
        },

        loginFail : (state, action)=>{
            state.loading = false;
            state.error = action.payload;
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
            
            state.isAuthorized  = 'unauthorized'
        },

        getMyInfoSuccess : (state, action )=> {
            state.authStatus = 'authenticated'  
            state.loading = false;
            state.user = action.payload.user.identity;
            state.isAuthenticated = action.payload.user.isAuthenticated;
            state.isAuthorized = action.payload.isAuthorized
            state.isOtpVerified = action.payload.user.isAuthenticated;
            state.permissions = action.payload.user.permissions
            
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