
import axios from "axios";
import api from "./axios";
export const updateSale = async () => {
  const response = await api.put('/api/sales');
  return response;
};

export const createSale = async () => {
  const response = await api.post('/api/sales');
  return response;
};
export const fetchSales = async () => {
  const response = await api.get('/api/sales');
  return response;
};

//get the sells amount by month  or date range, the serch query must provide with full date for start and end as quuery
export const getTotalSellsAmountByDateRange = async ( startDate , endDate ) => { // must be in year-month-day format in numeric
 //if the start date or end date is not provided use current one 
  if(startDate?.trim() === "" || endDate?.trim() === ""){
  const now = new Date();
  //start ddate of current year and month
  startDate = new Date(
    now.getFullYear(),
    now.getMonth(), 
    1
  );

  //end day of the current year and month
  endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    0
  );

 }

  const response = await api.get('/api/sales/amount', {
    params : {
     start :  startDate,
      end :  endDate
    }
  })
  return response;
}

export const getSellsAmountByDateRange = async() => {
  const response = await axios.get('' , {})
}