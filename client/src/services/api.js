
const BASE_URL = `http://localhost/api`;

export const userregisterAPI = async(formData) => {
      const response = await fetch(`${BASE_URL}/userregister.php`, {
            method : "POST",
            headers : {
                "Content-Type": "application/json",
            },
            body : JSON.stringify(formData),
        });

        const data = await response.json();

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