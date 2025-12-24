import axios from 'axios';
import { store } from '@/app/store';
import { logout } from '@/features/Auth/model/authSlice'; // Assuming store is exported from store setup

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth?.token; // Get token from Redux state
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
    // Handle token refresh logic here later if 401 and not already retrying refresh
    // For example: if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-tokens') { ... }
    //TODO: Implement refresh token logic here if backend supports it
    // For now, if 401, we'll just log out the user.
    const refreshToken = localStorage.getItem('refreshTokenTPX');
    if (refreshToken) {
      try {
        const { data } = await axiosInstance.post('/auth/refresh-tokens', { refreshToken });
        localStorage.setItem('accessTokenTPX', data.access.token);
        store.dispatch(/* action to update token in store */);
        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + data.access.token;
        originalRequest.headers['Authorization'] = 'Bearer ' + data.access.token;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        // Redirect to login might happen in App.jsx based on isAuthenticated
        return Promise.reject(refreshError);
      }
    } else {
      store.dispatch(logout());
    }
    console.error("AXIOS INTERCEPTOR 401: ", error.response.data.message);
    if (error.response.data.message !== "Email has not been verified. Please check your inbox.") {
      // Avoid logging out if it's just an email verification issue on login attempt
      store.dispatch(logout());
    }
  }
    return Promise.reject(error);
  }
);

export default axiosInstance;