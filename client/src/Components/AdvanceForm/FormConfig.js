export const formConfig  = {
    createStaff : [
        {name : 'firstName' , type : 'text' , required : true},
         {name : 'lastName' , type : 'text' , required : true},
        { name : 'email', type : 'email', required : true},
        {name : 'phoneNumber', type : 'tel' , reqired : true}, 
        {name : 'role', type : 'select' , options : ['admin', 'manager', 'salesperson'] , required : true},
        {name : 'password', type : 'text' , required : true}, 
    ],
    createVendor : [
        {name : 'name' , type : 'text' , required : true},
        { name : 'email', type : 'email', required : true},
        {name : 'address', type : 'text' , required : true}, 
        {name : 'contact', type : 'tel' , reqired : true}, 
    ], 
    createPurchase : [
        {name : 'vendor' , type : 'select' , options : [], required : true}, 
        {name : 'date', type : 'date' , required : true}
    ], 

    addPurchaseItems : [
        {name : 'category' , type : 'select' , options : [], required : true},
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

    createSale : [
        {name : 'customerId' , type : 'text' , required : false}, 

    ], 
    addSellsItems : [
        {name : 'product' , type : 'display', required : true}, 
        {name : 'stock' , type : 'display', required : true}, 
        {name : 'quantity', type : 'text', required : true}, 
        {name : 'unitPrice', type : 'display', required : true},
        {name : 'subTotal', type : 'display' , required : true},
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