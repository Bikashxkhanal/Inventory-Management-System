// const BASE_URL = `http://localhost/PROJECTS/INVENTORY-MANAGEMENT-SYSTEM/backend/public`;

import axios from 'axios'

export const userregisterAPI = async (formData) => {
  const response = await fetch(`/api/auth/user-register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();

  return { response, data };
};

export const companyregisterAPI = async (formData) => {
  const response = await fetch(`/api/auth/setup-company`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  console.log(data);

  return { response, data };
};

export const loginAPI = async (loginData) => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    let data = {};
    try {

      data = await response.json();
    } catch (e) {
      data = { success: false, message: "Invalid server response " };
    }
    console.log(data);
    return { response, data };
  } catch (networkError) {
    return {
      response: null,
      data: { success: false, message: networkError.message },
    };
  }
};

//Email Otp verification API

export const EmailOtpVerificationAPI = async (emailOtp) => {
  const response = await fetch("/api/auth/otp-verification", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(emailOtp),
  });

  const data = await response.json();
  return { response, data };
};

export const userVerifyAPI = async () => {
  try {
    const response = await fetch("/api/auth/verify-user", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });


    const contentType = response.headers.get("content-type");

    let data = {};

    try {
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
        return {
          response,
          data: {
            success: false,
            message: "server didnot return json data",
          },
        };
      }
    } catch (e) {
      return (data = { success: false, message: "invalid server response" });
    }
    console.log(data);
    return { response, data };
  } catch (networkError) {
    return {
      response: null,
      data: { success: false, message: networkError.message },
    };
  }
};

export const logoutAPI = async () => {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",

      headers: {
        Accept: "application/json",
      },
    });
     let data = {}


    try {
    data = await response.json();
    console.log(data);
    } catch (err) {
      return {
        response,
        data: {
          success: false,
          message: "failed to return json",
        },
      };
    }
    
    return { response, data };
  } catch (networkError) {
    return {
      response: null,
      data: {
        success: false,
        message: networkError.message,
      },
    };
  }
};

export const createStaffAPI = async (data) => {
    const response = await axios.post('/api/create-staff', data)
    console.log(response.data);
    
    return response.data;
  
}
