// frontend/src/features/Auth/model/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/core/api/axiosInstance';
import { toast } from 'react-toastify';

const initialState = {
  user: null,
  token: localStorage.getItem('accessTokenTPX') || null, // Added TPX suffix
  isAuthenticated: !!localStorage.getItem('accessTokenTPX'),
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Thunks
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      // Backend sends user object, and email verification is triggered
      toast.success('Registration successful! Please check your email to verify your account.');
      return response.data.user; // Assuming backend returns { user: UserObject }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      // response.data = { user, tokens: { access: { token, expires }, refresh: { token, expires } } }
      localStorage.setItem('accessTokenTPX', response.data.tokens.access.token);
      localStorage.setItem('refreshTokenTPX', response.data.tokens.refresh.token);
      return response.data; // Contains user and tokens
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials or verify your email.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { token } = getState().auth; // Should be from initial state or login
    if (!token) return rejectWithValue('No token available for fetching user.');
    try {
      const response = await axiosInstance.get('/users/me');
      return response.data; // User object
    } catch (error) {
      // If token is invalid/expired, backend returns 401, caught here
      dispatch(logout()); // Clear local state and tokens
      // toast.error('Session expired. Please log in again.'); // Optional toast
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current user.');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      toast.info('If an account with that email exists, a password reset link has been sent.');
      return email;  
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send password reset email.';
      toast.error(message); // Might still show generic message to user
      return rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/auth/reset-password?token=${token}`, { password });
      toast.success('Password has been reset successfully! You can now log in.');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/auth/verify-email?token=${token}`);
      // Backend handles setting user.isEmailVerified = true
      toast.success('Email verified successfully! You can now log in.');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed. The link may be invalid or expired.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
    'auth/resendVerificationEmail',
    async (email, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/auth/resend-verification-email', { email });
            toast.info('If an account exists for that email and is unverified, a new verification link has been sent.');
            return email;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to resend verification email.';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('accessTokenTPX');
      localStorage.removeItem('refreshTokenTPX');
      // Note: No API call for logout here, as backend /auth/logout expects refreshToken in body.
      // Client-side logout is primary. Backend token invalidation is good for security.
      // We can dispatch an async thunk for logout if we want to call the backend.
    },
    // Used by fetchCurrentUser if token is valid
    setUserOnLoad: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = 'succeeded';
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.status = 'succeeded'; /* User not logged in yet, needs to verify */ })
      .addCase(registerUser.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      // Login
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.tokens.access.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true; // Token was already present and validated
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'idle'; 
        state.error=action.payload// Or 'failed', but logout handles clearing auth state
        // Error is logged by thunk, logout action is dispatched
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(forgotPassword.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(forgotPassword.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      // Reset Password
      .addCase(resetPassword.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(resetPassword.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(resetPassword.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(verifyEmail.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(verifyEmail.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      // Resend Verification Email
      .addCase(resendVerificationEmail.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(resendVerificationEmail.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(resendVerificationEmail.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

export const { logout, setUserOnLoad } = authSlice.actions; // Renamed setUser to setUserOnLoad for clarity
export default authSlice.reducer;
