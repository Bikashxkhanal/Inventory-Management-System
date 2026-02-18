import { useMutation, useQueryClient } from "@tanstack/react-query"


const useMutate = (mutateFn, options= {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn : mutateFn,
        ...options, 
        onSuccess : (data) => {
            console.log(data);
            
            if(options.invalidateQueryKey) {
                queryClient.invalidateQueries([options.invalidateQueries])
            }
            if(options.onSuccess) options.onSuccess(data)
        },
    onError : (error) => {
        if(options.onError) options.onError(error)
    },
        
    })
}

export default useMutate;