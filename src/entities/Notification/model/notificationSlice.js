import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/core/api/axiosInstance';
import { API_ENDPOINTS } from '@/shared/config/apiConfig';
import { toast } from 'react-toastify';

const initialState = {
  notifications: [],
  pagination: { hasMore: true, currentPage: 1 },
  unreadCount: 0,
  status: 'idle',
};

// Thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 1, limit = 15 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS, { params: { page, limit } });
      // response.data = { results, page, limit, totalPages, totalResults, unreadCount, hasMore }
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch notifications.');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const markNotificationsAsRead = createAsyncThunk(
  'notifications/markNotificationsAsRead',
  async (notificationIds = [], { dispatch, rejectWithValue }) => { // Pass empty array to mark all as read
    try {
      await axiosInstance.patch(API_ENDPOINTS.NOTIFICATIONS_MARK_READ, { notificationIds });
      // After marking as read, refresh the notifications list to get updated state
      dispatch(fetchNotifications({ page: 1 }));
    } catch (error) {
      toast.error('Failed to mark notifications as read.');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      // Add new real-time notification to the top of the list
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state, action) => {
        state.unreadCount = Math.max(0, state.unreadCount - (action.payload?.count || 1));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state, action) => {
        // Only show full loading state on first page load
        if (action.meta.arg.page === 1) state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.page === 1) {
          state.notifications = action.payload.results;
        } else {
          // Append new notifications, avoiding duplicates
          const existingIds = new Set(state.notifications.map(n => n._id));
          const newNotifications = action.payload.results.filter(n => !existingIds.has(n._id));
          state.notifications.push(...newNotifications);
        }
        state.pagination = { hasMore: action.payload.hasMore, currentPage: action.payload.page };
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addNotification, decrementUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;