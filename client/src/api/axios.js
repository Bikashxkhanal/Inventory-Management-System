import axios from "axios";
import { responseErrorInterceptor, requestInterceptor, responseInterceptor } from "./interceptors";



const api = axios.create({
    baseURL : '', 
    withCredentials : true, 
    timeout : 10000,
    headers : {"Content-Type": 'application/json'}
});

api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export default api;