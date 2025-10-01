import { createSlice } from '@reduxjs/toolkit';
import { type CartItemType } from '@/types';

interface CartState {
  items: CartItemType[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: { payload: CartItemType }) => {
      const existing = state.items.find(i => i.product._id === action.payload.product._id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    updateQuantity: (state, action: { payload: { id: string; quantity: number } }) => {
      const item = state.items.find(i => i.product._id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
    removeFromCart: (state, action: { payload: string }) => {
      state.items = state.items.filter(i => i.product._id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;