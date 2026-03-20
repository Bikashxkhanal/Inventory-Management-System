import {configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './authSlice';
import cartReducer from './cartSlice'

const cartPersistStorage = {
    key : "salesItemsCart", 
    storage
}

const persistedCartReducer = persistReducer(cartPersistStorage, cartReducer)

const store = configureStore({
    reducer: {
        auth : authReducer,  
        salesItemsCart : persistedCartReducer 
    }
})

export const persistor = persistStore(store);
export default store;