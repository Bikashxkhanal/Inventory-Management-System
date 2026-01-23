import { staffData } from "../Staff/StaffData";

export const conditionalData = [

   
    {
      name: "In stock",
      color: "green",
      value: 900,
      total: 3000,
    },
    {
      name: "High stock",
      color: "yellow",
      value: 1600,
      total: 3000,
    },
    {
      name: "out of stock",
      color: "red",
      value: 500,
      total: 3000,
    },
  ];

  export const tableData = [
    {
      "productId": 1001,
      "product name": "Shoes",
      category: "Fashion",
      Quantity: 2000,
      status: "in stock",
    },

    {
      "productId": 1002,
      "product name": "Tshirt",
      category: "Fashion",
      Quantity: 50,
      status: "out of stock",
    },
     {
      "productId": 1001,
      "product name": "Shoes",
      category: "Fashion",
      Quantity: 2000,
      status: "in stock",
    },

    {
      "productId": 1002,
      "product name": "Tshirt",
      category: "Fashion",
      Quantity: 50,
      status: "out of stock",
    },
     {
      "productId": 1001,
      "product name": "Shoes",
      category: "Fashion",
      Quantity: 2000,
      status: "in stock",
    },

    {
      "productId": 1002,
      "product name": "Tshirt",
      category: "Fashion",
      Quantity: 50,
      status: "out of stock",
    },
     {
      "productId": 1001,
      "product name": "Shoes",
      category: "Fashion",
      Quantity: 2000,
      status: "in stock",
    },

    {
      "productId": 1002,
      "product name": "Tshirt",
      category: "Fashion",
      Quantity: 50,
      status: "out of stock",
    },
     {
      "productId": 1001,
      "product name": "Shoes",
      category: "Fashion",
      Quantity: 2000,
      status: "in stock",
    },

    {
      "productId": 1002,
      "product name": "Tshirt",
      category: "Fashion",
      Quantity: 50,
      status: "out of stock",
    },
     {
      "productId": 1001,
      "product name": "Shoes",
      category: "Fashion",
      Quantity: 2000,
      status: "in stock",
    },

    {
      "productId": 1002,
      "product name": "Tshirt",
      category: "Fashion",
      Quantity: 50,
      status: "out of stock",
    },
     {
      "productId": 1001,
      "product name": "Shoes",
      category: "Fashion",
      Quantity: 2000,
      status: "in stock",
    },

    {
      "productId": 1002,
      "product name": "Tshirt",
      category: "Fashion",
      Quantity: 50,
      status: "out of stock",
    },
  ]; 


  const dbData = Array.from({length: 52}, (_, i) => ({
    productId : i+1,
    productName : i% 3 == 0 ? "Shoes" : "T-shirt",
    category : i %3 === 0 ? 'Foot-wear' : 'Mens-wear',
    Quantity : i<10 ? 100 : 200,
    status : i<10 ? 'out-of-stock' : 'in-stock',
  }) )


  function stockData(shouldFail = false, page = 1, limit = 10){
    return new Promise((resolve, reject) => {
      setTimeout(() => {

        if(shouldFail){
          reject(new Error("Failed to fetch"))

        }else{
          const offSet = (page -1 ) * limit;
          const paginatedData =  dbData.slice(offSet, offSet+limit);
          resolve( {
            page, limit, total: dbData.length, totalPages : Math.ceil(dbData.length/limit),
            data : paginatedData
          } )
        }

      }, 500)
    })
  }

  export default stockData;