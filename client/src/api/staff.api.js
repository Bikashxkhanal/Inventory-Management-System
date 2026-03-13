import api from "./axios"

const createStaff = async (payload) => {
    const {data} = await api.post('/api/staff/create', payload)
    return data;
}

const fetchStaff = async ({page =1, limit = 10}) => {
    const {data} = await api.get('/api/staff', {
    params: { page, limit }
})

// console.log(data);


    return data;
}


export const fetchStaffStats = async () => {
  const res = await api.get("/api/staff/stats");
  console.log(res);
  
  return res.data; // returns { total, admin, sales, manager }
};



export {createStaff, fetchStaff}