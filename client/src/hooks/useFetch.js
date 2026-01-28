import {  useQuery } from "@tanstack/react-query";

const useFetch = (key, queryFn, options = {}) => {
    return useQuery({
        queryKey : [key], 
        queryFn : queryFn, 
        ...options
    })
    
}

export default useFetch;