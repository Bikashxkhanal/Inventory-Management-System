import { createSlice } from "@reduxjs/toolkit";


const initialState = {
        cartSalesItems : []
}


const cartSlice = createSlice({
    name : "salesItemsCart", 
    initialState, 

    reducers : {
            addSalesItemsToCart : (state, action) => {
                    state.cartSalesItems.push(action.payload);
            },
            removeSalesItemsFromCart : (state, action) => {
                    state.cartSalesItems = state.cartSalesItems.filter((items) => items.name !==action.payload)
            }, 
            clearAllSalesItems : (state) => {
                state.cartSalesItems = [];
            }
    }
})

export const {addSalesItemsToCart, removeSalesItemsFromCart , clearAllSalesItems} = cartSlice.actions;
export default cartSlice.reducer;