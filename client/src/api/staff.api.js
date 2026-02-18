import api from "./axios"

const createStaff = async (payload) => {
    const {data} = await api.post('/api/staff/create', payload)
    return data;
}

const fetchStaff = async ({page =1, limit = 10}) => {

    const {data} = await api.get('/api/staff')
    return data;
}


export {createStaff, fetchStaff}