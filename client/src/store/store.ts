import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import productReducer from './features/productSlice';
import orderReducer from './features/orderSlice';
import cartReducer from './features/cartSlice';
import paymentReducer from './features/paymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    order: orderReducer,
    cart: cartReducer,
    payment: paymentReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
