import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';
import { type UserType } from '@/types';
import { AxiosError } from 'axios';

interface AuthState {
    user: UserType | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    isEmailVerificationPending: boolean;
    userEmail: string | null;
    otpExpiresAt: Date | null;
    isResendingOtp: boolean;
}

interface ApiError {
    message: string;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    isCheckingAuth: false,
    isEmailVerificationPending: false,
    userEmail: null,
    otpExpiresAt: null,
    isResendingOtp: false,
};

// Send OTP for registration
export const sendRegistrationOtp = createAsyncThunk<
    { email: string; expiresIn: number },
    { name: string; phone: string; email: string; password: string },
    { rejectValue: ApiError }
>(
    'auth/send-registration-otp',
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/auth/send-registration-otp', data);
            toast.success(res.data.message);
            return { email: res.data.email, expiresIn: res.data.expiresIn };
        } catch (error) {
            let errorMessage = 'Failed to send OTP';
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

// Verify OTP and complete registration
export const verifyAndRegister = createAsyncThunk<
    UserType,
    { email: string; otp: string },
    { rejectValue: ApiError }
>(
    'auth/verify-and-register',
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/auth/verify-and-register', data);
            toast.success(res.data.message);
            return res.data.user;
        } catch (error) {
            let errorMessage = 'Verification failed';
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

// Resend OTP
export const resendOtp = createAsyncThunk<
    { expiresIn: number },
    { email: string },
    { rejectValue: ApiError }
>(
    'auth/resend-otp',
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/auth/resend-otp', data);
            toast.success(res.data.message);
            return { expiresIn: res.data.expiresIn };
        } catch (error) {
            let errorMessage = 'Failed to resend OTP';
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

// Login
export const login = createAsyncThunk<
    UserType,
    { phone: string; password: string },
    { rejectValue: ApiError & { email?: string } }
>(
    'auth/login',
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/auth/login', data);
            toast.success(res.data.message);
            return res.data.user;
        } catch (error) {
            let errorMessage = 'Login failed';
            let email: string | undefined;
            
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || errorMessage;
                email = error.response?.data?.email;
            }
            
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage, email });
        }
    }
);

// Logout
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

// Get current user
export const getMe = createAsyncThunk<UserType, void, { rejectValue: ApiError }>(
    'auth/getMe',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/auth/me');
            return res.data.user;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status !== 401) {
                    console.log(error);
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
    reducers: {
        clearEmailVerificationPending: (state) => {
            state.isEmailVerificationPending = false;
            state.userEmail = null;
            state.otpExpiresAt = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Send Registration OTP
            .addCase(sendRegistrationOtp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(sendRegistrationOtp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isEmailVerificationPending = true;
                state.userEmail = action.payload.email;
                // Calculate expiry date from expiresIn seconds
                state.otpExpiresAt = new Date(Date.now() + action.payload.expiresIn * 1000);
            })
            .addCase(sendRegistrationOtp.rejected, (state) => {
                state.isLoading = false;
            })
            // Verify and Register
            .addCase(verifyAndRegister.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyAndRegister.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isEmailVerificationPending = false;
                state.userEmail = null;
                state.otpExpiresAt = null;
            })
            .addCase(verifyAndRegister.rejected, (state) => {
                state.isLoading = false;
            })
            // Resend OTP
            .addCase(resendOtp.pending, (state) => {
                state.isResendingOtp = true;
            })
            .addCase(resendOtp.fulfilled, (state, action) => {
                state.isResendingOtp = false;
                // Update expiry date
                state.otpExpiresAt = new Date(Date.now() + action.payload.expiresIn * 1000);
            })
            .addCase(resendOtp.rejected, (state) => {
                state.isResendingOtp = false;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                // If login failed due to unverified email, set verification pending
                if (action.payload?.email) {
                    state.isEmailVerificationPending = true;
                    state.userEmail = action.payload.email;
                }
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            // Get Me
            .addCase(getMe.pending, (state) => {
                state.isCheckingAuth = true;
            })
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

export const { clearEmailVerificationPending } = authSlice.actions;
export default authSlice.reducer;