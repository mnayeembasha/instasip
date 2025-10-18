import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { type CartItemType } from '@/types';
import {BACKEND_URL} from '@/config';
const API_URL = BACKEND_URL;
import { logout } from './authSlice';

interface CartState {
  items: CartItemType[];
  isFetchingCart: boolean;
  isAddingToCart: boolean;
  isUpdatingCart: boolean;
  isRemovingFromCart: boolean;
  isClearingCart: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  isFetchingCart: false,
  isAddingToCart: false,
  isUpdatingCart: false,
  isRemovingFromCart: false,
  isClearingCart: false,
  error: null,
};

// Fetch cart from backend
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        withCredentials: true,
      });
      return response.data.cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/add`,
        { productId, quantity },
        { withCredentials: true }
      );
      return response.data.cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

// Update cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/cart/update/${productId}`,
        { quantity },
        { withCredentials: true }
      );
      return response.data.cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/cart/remove/${productId}`, {
        withCredentials: true,
      });
      return response.data.cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/cart/clear`, {
        withCredentials: true,
      });
      return response.data.cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isFetchingCart = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isFetchingCart = false;
        state.items = action.payload.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
        }));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isFetchingCart = false;
        state.error = action.payload as string;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isAddingToCart = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isAddingToCart = false;
        state.items = action.payload.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
        }));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isAddingToCart = false;
        state.error = action.payload as string;
      })
      // Update cart item
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.isUpdatingCart = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.isUpdatingCart = false;
        state.items = action.payload.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
        }));
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.isUpdatingCart = false;
        state.error = action.payload as string;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.isRemovingFromCart = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isRemovingFromCart = false;
        state.items = action.payload.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
        }));
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isRemovingFromCart = false;
        state.error = action.payload as string;
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.isClearingCart = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isClearingCart = false;
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isClearingCart = false;
        state.error = action.payload as string;
      })
      // Handle logout from auth slice
      .addCase(logout.fulfilled, (state) => {
        state.items = [];
        state.error = null;
      });
  },
});



export const { resetCartError } = cartSlice.actions;
export default cartSlice.reducer;