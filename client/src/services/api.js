
const BASE_URL = `http://localhost/PROJECTS/INVENTORY-MANAGEMENT-SYSTEM/backend/public`;


export const userregisterAPI = async(formData) => {
    const response = await fetch(`${BASE_URL}/api/auth/user-register`, {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(formData),
    });

        console.log(response);
    const data = await response.json();
    console.log(data);
    
    return {response, data};
}

export const companyregisterAPI = async(formData) => {
      const response = await fetch(`${BASE_URL}/api/auth/setup-company`, {
            method : "POST",
            headers : {
                "Content-Type": "application/json",
            },
            body : JSON.stringify(formData),
        });
        console.log(response);
        const data = await response.text();
        console.log(data);
        return {response, data};

}

export const loginAPI =  async(loginData) => {
     const response = await fetch(`${BASE_URL}/login.php`, {
            method : "POST",
            headers : {
                "Content-Type": "application/json",
            },
            body : JSON.stringify(loginData),
        });

        
        const data = await response.json();
    
        return {response, data};

}


//Email Otp verification API

export const EmailOtpVerificationAPI =  async(emailOtp) => {
    const response = await fetch(`${BASE_URL}/api/auth/otp-verification`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },

        body : JSON.stringify(emailOtp),
});

    console.log(response);
    const data = await response.json();
    console.log(data);
    return {response, data};


}