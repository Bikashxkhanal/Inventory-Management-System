

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
    const data = error.response?.data;
    const message =
      (typeof data === 'object' && data?.message) ||
      (typeof data === 'string' ? data : null) ||
      error.message ||
      'something went wrong';
    return Promise.reject({ status, message, data })
}

export {requestInterceptor, responseInterceptor, responseErrorInterceptor}