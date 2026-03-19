import {  useQuery } from "@tanstack/react-query";

const useFetch = (key, queryFn, options = {}) => {
    return useQuery({
        queryKey: Array.isArray(key) ? key : [key],
        queryFn : queryFn, 
        ...options
    })
    
}

export default useFetch;