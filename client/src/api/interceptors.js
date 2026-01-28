

const requestInterceptor = (config) => {
    if(!config.timeout) {
        config.timeout = 10000;
    }
    return config;

}

const responseInterceptor = (response) => {
    return response.data;

}

const responseErrorInterceptor  = (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'something went wrong';
    return Promise.reject({status, message})
}

export {requestInterceptor, responseInterceptor, responseErrorInterceptor}