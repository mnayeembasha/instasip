import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';
import { type UserType } from '@/types';
import { AxiosError } from 'axios';

interface AuthState {
  user: UserType | null;
  isLoading: boolean;
  isCheckingAuth:boolean;
}

interface ApiError {
  message: string;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isCheckingAuth:false
};

export const register = createAsyncThunk<UserType, { name: string; phone: string; password: string }, { rejectValue: ApiError }>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/register', data);
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      let errorMessage = 'Registration failed';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const login = createAsyncThunk<UserType, { phone: string; password: string }, { rejectValue: ApiError }>(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/login', data);
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      let errorMessage = 'Login failed';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const logout = createAsyncThunk<void, void, { rejectValue: ApiError }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/logout');
      toast.success(res.data.message);
    } catch (error) {
      let errorMessage = 'Logout failed';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const getMe = createAsyncThunk<UserType, void, { rejectValue: ApiError }>(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/auth/me');
      return res.data.user;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status !== 401) {
          toast.error(error.response?.data?.message || 'Failed to fetch user');
        }
        return rejectWithValue({ message: error.response?.data?.message || 'Failed to fetch user' });
      }
      return rejectWithValue({ message: 'Unknown error' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.isLoading = true; })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state) => { state.isLoading = false; })
      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state) => { state.isLoading = false; })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(getMe.pending, (state) => { state.isCheckingAuth = true; })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state) => {
        state.isCheckingAuth = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;