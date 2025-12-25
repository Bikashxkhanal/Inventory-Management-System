import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

//register the business , login into system , OTP verification 

const initialState = {
    company: {
        companyId : null,
        companyName: null,
        companyEmail: null,
        companyNumber: null,
    },
    user: {
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
        },

        registerUserFail : (state, action)=> {
            state.loading = false;
            state.error = action.payload;
        },

        loginStart: (state)=>{
            state.loading = true;
        },

        loginSucess : (state, action)=>{
            state.loading = false;
            state.user = action.payload.user;
            // state.token = action.payload.token;
            state.isAuthenticated = true;
            state.company = action.payload.company;
            state.isOtpVerified = true;
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
            state.isOtpVerified = true;
        },
        otpFail : (state, action) => {
            state.loading = false;
            state.isOtpVerified = false;
            state.error = action.payload;
        },

        dashboardAccessStart: (state) => {
            state.loading = true;

        },

        updateRoleaftDashSuccess : (state, action) => { // update role after success 
            state.loading = false;
            state.user.user_role = action.payload;
           
        },

        updatePrmsaftDashSuccess : (state, action) => { // update permissions after success 
            state.loading = false;
            state.permissions = action.payload;
        },


        dashboardAccessFail : (state) => {
            state.loading = false;
        },

        isUserAuthenticated : (state, action) => {
            state.isAuthenticated = action.payload;
        }

    }

})

export const {registerUserStart, registerUserSuccess, registerUserFail,
    registerCompanyStart, registerCompanySuccess, registerCompanyFail, loginStart, loginSucess, loginFail, otpStart, otpSuccess, otpFail, dashboardAccessFail, dashboardAccessStart, updatePrmsaftDashSuccess, updateRoleaftDashSuccess, isUserAuthenticated}  = authSlice.actions;

export default authSlice.reducer;