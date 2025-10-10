import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { type PaymentType, type PaymentStatsType, type DailyStatsType } from '@/types';
import { axiosInstance } from '@/lib/axios';

interface PaymentState {
  payments: PaymentType[];
  stats: PaymentStatsType | null;
  dailyStats: DailyStatsType[];
  selectedPayment: PaymentType | null;
  isFetchingPayments: boolean;
  isFetchingStats: boolean;
  error: string | null;
}

interface ApiError {
  message: string;
}

const initialState: PaymentState = {
  payments: [],
  stats: null,
  dailyStats: [],
  selectedPayment: null,
  isFetchingPayments: false,
  isFetchingStats: false,
  error: null,
};

interface FetchPaymentsParams {
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export const fetchAllPayments = createAsyncThunk<
  { payments: PaymentType[]; stats: PaymentStatsType },
  FetchPaymentsParams,
  { rejectValue: ApiError }
>(
  'payment/fetchAllPayments',
  async (params, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/payment/admin/all', { params });
      return { payments: res.data.payments, stats: res.data.stats };
    } catch (error) {
      let errorMessage = 'Failed to fetch payments';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const fetchPaymentStats = createAsyncThunk<
  { stats: Record<string, string | number>; dailyStats: DailyStatsType[] },
  string,
  { rejectValue: ApiError }
>(
  'payment/fetchPaymentStats',
  async (period, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/payment/admin/stats', {
        params: { period }
      });
      return { stats: res.data.stats, dailyStats: res.data.dailyStats };
    } catch (error) {
      let errorMessage = 'Failed to fetch payment statistics';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const fetchPaymentById = createAsyncThunk<PaymentType, string, { rejectValue: ApiError }>(
  'payment/fetchPaymentById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/payment/admin/${id}`);
      return res.data.payment;
    } catch (error) {
      let errorMessage = 'Failed to fetch payment details';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      return rejectWithValue({ message: errorMessage });
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedPayment: (state) => {
      state.selectedPayment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPayments.pending, (state) => {
        state.isFetchingPayments = true;
        state.error = null;
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.isFetchingPayments = false;
        state.payments = action.payload.payments;
        state.stats = action.payload.stats;
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.isFetchingPayments = false;
        state.error = action.payload?.message || 'Error';
      })
      .addCase(fetchPaymentStats.pending, (state) => {
        state.isFetchingStats = true;
        state.error = null;
      })
      .addCase(fetchPaymentStats.fulfilled, (state, action) => {
        state.isFetchingStats = false;
        state.dailyStats = action.payload.dailyStats;
      })
      .addCase(fetchPaymentStats.rejected, (state, action) => {
        state.isFetchingStats = false;
        state.error = action.payload?.message || 'Error';
      })
      .addCase(fetchPaymentById.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.selectedPayment = action.payload;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.error = action.payload?.message || 'Error';
      });
  },
});

export const { clearError, clearSelectedPayment } = paymentSlice.actions;
export default paymentSlice.reducer;