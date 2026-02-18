export const formConfig  = {
    createStaff : [
        {name : 'firstName' , type : 'text' , required : true},
         {name : 'lastName' , type : 'text' , required : true},
        { name : 'email', type : 'email', required : true},
        {name : 'phoneNumber', type : 'tel' , reqired : true}, 
        {name : 'role', type : 'select' , options : ['admin', 'manager', 'sales person'] , required : true},
        {name : 'password', type : 'text' , required : true}, 
    ],
    createVendor : [
        {name : 'name' , type : 'text' , required : true},
        { name : 'email', type : 'email', required : true},
        {name : 'address', type : 'text' , required : true}, 
        {name : 'contact', type : 'tel' , reqired : true}, 
    ], 
    createPurchase : [
        {name : 'poId', type : 'text', required : true},
        {name : 'title', type : 'text' , required : true, min : 5},
        {name : 'discription' , type : 'text', required : true, min : 5 , max : 50}, 
        {name : 'vendor' , type : 'select' , options : [], required : true}, 
        {name : 'totalValue' , type : 'text' , required : true}, 
        {name : 'receivedDate', type : 'date' , required : true}
    ], 

    addPurchaseItems : [
        {name : 'product' , type : 'select' , options : [], required : true},
        {name : 'quantity', type : 'text', required : true, min : 1},
        {name : 'price' , type : 'text', required : true, min : 1}
    ],

    createPo : [
        {name : 'title', type : 'text' , required : true, min : 5},
        {name : 'discription' , type : 'text', required : true, min : 5 , max : 50},  

    ],
    addPoItems : [
         {name : 'product' , type : 'select' , options : [], required : true},
          {name : 'quantity', type : 'text', required : true, min : 1},
    ],

    createSell : [
        {name : 'customerId' , type : 'text' , required : false}, 

    ], 
    addSellsItems : [
        {name : 'product' , type : 'select', options : [], required : true}, 
        {name : 'quantity', type : 'text', required : true}, 
        {name : 'unitPrice', type : 'text', required : true},
        {name : 'subTotal', type : 'text' , required : true},
    ],
    createProduct : [
        {name : 'name' , type : 'text' , required : true}, 
        {name : 'category', type : 'select', options : [], required : true},
        {name : 'status', type : 'select' , options : ['available', 'unavailable'], required : true}
    ], 
    createCategory : [
         {name : 'name' , type : 'text' , required : 'true'}, 
         {name : 'status', type : 'select' , options : ['available', 'unavailable'], required : true}
    ], 

}