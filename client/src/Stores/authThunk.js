import {
  registerUserStart,
  registerUserSuccess,
  registerUserFail,
  registerCompanyStart,
  registerCompanySuccess,
  registerCompanyFail,
  loginStart,
  loginSucess,
  loginFail,
  otpStart,
  otpSuccess,
  otpFail,
  getUserMeFail,
  getUserMeStart,
  getMyInfoSuccess,
  logoutFail, 
  logoutSuccess
} from "./authSlice";

import {
  loginAPI,
  userregisterAPI,
  EmailOtpVerificationAPI,
  companyregisterAPI,
  userVerifyAPI,
  logoutAPI,
} from "../services/api";

const BASE_URL = `http://localhost/PROJECTS/INVENTORY-MANAGEMENT-SYSTEM/backend/public`;

//User resgistration request to PHP
export const registerCompany = (formData) => async (dispatch) => {
  try {
    dispatch(registerCompanyStart());
    const { response, data } = await companyregisterAPI(formData);

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    if (!data.success) {
      throw new Error(data.message || "Registration Failed");
    }

    dispatch(registerCompanySuccess(data.company));
  } catch (error) {
    dispatch(registerCompanyFail(error.message));
  }
};

//company registration call to php using API
export const registerUser = (formData) => async (dispatch) => {
  try {
    dispatch(registerUserStart());
    const { response, data } = await userregisterAPI(formData);

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    if (!data.success) {
      throw new Error(data.message || "Registration Failed");
    }

    dispatch(registerUserSuccess(data.user));
  } catch (error) {
    dispatch(registerUserFail(error.message));
  }
};

//User login request to PHP
export const loginUser = (loginData) => async (dispatch) => {
  try {
    dispatch(loginStart());

    const { response, data } = await loginAPI(loginData);

    if (!response.ok) {
      throw new Error(data.message || "Failed to login");
    }

    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }

    dispatch(loginSucess(data));
  } catch (error) {
    dispatch(loginFail(error.message));
  }
};

//OTP verification

export const emailOtp = (emailOtp) => async (dispatch) => {
  try {
    dispatch(otpStart());
    const { response, data } = await EmailOtpVerificationAPI(emailOtp);
    if (!response.ok) {
      throw new Error(data.message || "Otp verification failed");
    }
    if (!data.success) {
      throw new Error(data.message || "Wrong OTP");
    }

    dispatch(otpSuccess());
  } catch (error) {
    dispatch(otpFail(error.message));
  }
};

export const verifyUserType = () => async (dispatch) => {
  try {
    dispatch(getUserMeStart());
    const { response, data } = await userVerifyAPI();
    console.log(data);

    if (!response.ok) {
      throw new Error(data.message || "cannot verify user");
    }

    if (!data.success) {
      throw new Error(data.message || "cannot verify user");
    }
    dispatch(getMyInfoSuccess(data));
  } catch (err) {
    console.log(err.message);

    dispatch(getUserMeFail());
  }
};

export const logout = () => async (dispatch) => {
  try {

    const { response, data } = await logoutAPI();
    if (!response.ok) {
      throw new Error("failed to logout");
    }
    if (!data.success) {
      throw new Error("failed to logout");
    }

    window.location.href = '/login';
    dispatch(logoutSuccess(data.message));
  } catch (err) {
    dispatch(logoutFail(err.message));
  }
};
