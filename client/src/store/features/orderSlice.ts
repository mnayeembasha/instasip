import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { type OrderType } from '@/types';
import { axiosInstance } from '@/lib/axios';

interface OrderState {
  orders: OrderType[];
  adminOrders: OrderType[];
  isFetchingOrders: boolean;
  isFetchingAdminOrders: boolean;
  isCreatingOrder: boolean;
  isUpdatingStatus: boolean;
  isCancellingOrder: boolean;
  error: string | null;
}

interface ApiError {
  message: string;
}

const initialState: OrderState = {
  orders: [],
  adminOrders: [],
  isFetchingOrders: false,
  isFetchingAdminOrders: false,
  isCreatingOrder: false,
  isUpdatingStatus: false,
  isCancellingOrder: false,
  error: null,
};

export const fetchMyOrders = createAsyncThunk<OrderType[], void, { rejectValue: ApiError }>(
  'order/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/orders/my');
      return res.data.orders;
    } catch (error) {
      let errorMessage = 'Failed to fetch orders';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      return rejectWithValue({ message: errorMessage });
    }
  }
);

interface FetchAdminOrdersParams {
  status?: string;
}

export const fetchAdminOrders = createAsyncThunk<OrderType[], FetchAdminOrdersParams, { rejectValue: ApiError }>(
  'order/fetchAdminOrders',
  async (params, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/orders/admin/all', { params });
      return res.data.orders;
    } catch (error) {
      let errorMessage = 'Failed to fetch admin orders';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      return rejectWithValue({ message: errorMessage });
    }
  }
);

interface CreateOrderData {
  items: { product: string; quantity: number }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export const createOrder = createAsyncThunk<OrderType, CreateOrderData, { rejectValue: ApiError }>(
  'order/createOrder',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/orders', data);
      toast.success(res.data.message);
      return res.data.order;
    } catch (error) {
      let errorMessage = 'Error creating order';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const cancelOrder = createAsyncThunk<string, string, { rejectValue: ApiError }>(
  'order/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/orders/${id}/cancel`);
      toast.success(res.data.message);
      return id;
    } catch (error) {
      let errorMessage = 'Error cancelling order';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const updateOrderStatus = createAsyncThunk<OrderType, { id: string; status: string }, { rejectValue: ApiError }>(
  'order/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/orders/admin/${id}/status`, { status });
      toast.success(res.data.message);
      return res.data.order;
    } catch (error) {
      let errorMessage = 'Error updating order status';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => { state.isFetchingOrders = true; state.error = null; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.isFetchingOrders = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.isFetchingOrders = false;
        state.error = action.payload?.message || 'Error';
      })
      .addCase(fetchAdminOrders.pending, (state) => { state.isFetchingAdminOrders = true; state.error = null; })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.isFetchingAdminOrders = false;
        state.adminOrders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.isFetchingAdminOrders = false;
        state.error = action.payload?.message || 'Error';
      })
      .addCase(createOrder.pending, (state) => { state.isCreatingOrder = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreatingOrder = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreatingOrder = false;
        state.error = action.payload?.message || 'Error';
      })
      .addCase(cancelOrder.pending, (state) => { state.isCancellingOrder = true; state.error = null; })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isCancellingOrder = false;
        const index = state.orders.findIndex(o => o._id === action.payload);
        if (index !== -1) state.orders[index].status = 'cancelled';
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isCancellingOrder = false;
        state.error = action.payload?.message || 'Error';
      })
      .addCase(updateOrderStatus.pending, (state) => { state.isUpdatingStatus = true; state.error = null; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isUpdatingStatus = false;
        const index = state.adminOrders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) state.adminOrders[index] = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isUpdatingStatus = false;
        state.error = action.payload?.message || 'Error';
      });
  },
});

export const { clearError } = orderSlice.actions;
export default orderSlice.reducer;