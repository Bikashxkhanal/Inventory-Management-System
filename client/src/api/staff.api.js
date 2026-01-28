import api from "./axios"

const createStaff = async (payload) => {
    const {data} = await api.post('/api/staff/create', payload)
    return data;
}

const getStaff = async () => {

    const {data} = await api.get('/api/staff')
    return data;
}


export {createStaff, getStaff}