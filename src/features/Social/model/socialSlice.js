import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/core/api/axiosInstance";
import { API_ENDPOINTS } from "@/shared/config/apiConfig";
import { toast } from "react-toastify";
import { setUserOnLoad } from "@/features/Auth/model/authSlice";

// This slice will handle:
// 1. The current user's list of who THEY ARE FOLLOWING.
// 2. Data for a VIEWED USER'S PROFILE (their followers, who they are following, and if current user follows them).

const initialState = {
  // Current user's social graph
  currentUserFollowing: [], // Array of user IDs the current user is following

  // Viewed user profile's social data
  viewedProfile: {
    userId: null,
    followers: [], // List of users following the viewed profile
    following: [], // List of users the viewed profile is following
    isFollowedByCurrentUser: false, // Is the viewed profile followed by the logged-in user?
    followersCount: 0,
    followingCount: 0,
  },
  status: "idle", // for profile fetching/follow actions
  error: null,
};

// Thunk to toggle follow status for a user
export const toggleFollowUser = createAsyncThunk(
  "social/toggleFollowUser",
  async (userIdToFollow, { getState, rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.USER_TOGGLE_FOLLOW(userIdToFollow)
      );
      // response.data = { isFollowing: boolean }
      const currentUserId = getState().auth.user?._id;

      // Update current user's following list if this action pertains to them
      if (currentUserId) {
        dispatch(fetchCurrentUserFollowing()); // Refresh the list of who current user follows
      }

      // If the toggled user is the currently viewed profile, update its status
      const viewedUserId = getState().social.viewedProfile.userId;
      if (viewedUserId === userIdToFollow) {
        dispatch(setIsFollowedByCurrentUser(response.data.isFollowing));
        // Optionally, refetch follower count for viewed profile if it changed
        dispatch(fetchFollowersForUser(userIdToFollow));
      }

      toast.success(
        response.data.isFollowing ? `Followed user!` : `Unfollowed user!`
      );
      return { userId: userIdToFollow, ...response.data };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update follow status"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Thunk to fetch users followed by the current user
export const fetchCurrentUserFollowing = createAsyncThunk(
  "social/fetchCurrentUserFollowing",
  async (_, { getState, rejectWithValue }) => {
    const currentUserId = getState().auth.user?._id;
    if (!currentUserId) return rejectWithValue("User not authenticated");
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.USER_FOLLOWING_LIST(currentUserId)
      );
      // response.data.results = array of user objects they are following
      return response.data.results.map((user) => user._id); // Store only IDs
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Thunks to fetch followers/following for a specific (viewed) user profile
export const fetchFollowersForUser = createAsyncThunk(
  "social/fetchFollowersForUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.USER_FOLLOWERS_LIST(userId)
      );
      // response.data = { results: UserStub[], page, limit, totalPages, totalResults }
      return {
        userId,
        followers: response.data.results,
        count: response.data.totalResults,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchFollowingForUser = createAsyncThunk(
  "social/fetchFollowingForUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.USER_FOLLOWING_LIST(userId)
      );
      return {
        userId,
        following: response.data.results,
        count: response.data.totalResults,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
export const fetchUserProfile = createAsyncThunk(
  'social/fetchUserProfile',
  async (userId, { getState, rejectWithValue }) => {
      try {
          const { user: currentUser } = getState().auth;
          // FIX: This thunk now correctly calls the defined API endpoint.
          const response = await axiosInstance.get(API_ENDPOINTS.USER_PROFILE(userId));
          // The backend now intelligently adds `isFollowedByCurrentUser` if applicable
          return response.data;
      } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to fetch user profile.');
          return rejectWithValue(error.response?.data?.message);
      }
  }
);

export const updateUserProfile = createAsyncThunk(
  'social/updateUserProfile',
  async (formData, { dispatch, rejectWithValue }) => { // Expects FormData
      try {
          const response = await axiosInstance.patch(API_ENDPOINTS.UPDATE_MY_PROFILE, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          toast.success('Profile updated successfully!');
          dispatch(setUserOnLoad(response.data)); // Update user in authSlice too
          return response.data;
      } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to update profile.');
          return rejectWithValue(error.response?.data?.message);
      }
  }
);

const socialSlice = createSlice({
  name: "social",
  initialState,
  reducers: {
    setViewedUserProfile: (state, action) => {
      // Call this when navigating to a profile page
      if (state.viewedProfile.userId !== action.payload.userId) {
        state.viewedProfile = {
          userId: action.payload.userId,
          followers: [],
          following: [],
          isFollowedByCurrentUser:
            action.payload.isFollowedByCurrentUser || false, // Set this from currentUserFollowing
          followersCount: 0,
          followingCount: 0,
        };
        state.status = "idle"; // Reset status for new profile
      }
    },
    clearViewedUserProfile: (state) => {
      state.viewedProfile = initialState.viewedProfile;
    },
    setIsFollowedByCurrentUser: (state, action) => {
      // Helper to directly set follow status
      state.viewedProfile.isFollowedByCurrentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle Follow
      .addCase(toggleFollowUser.pending, (state) => {
        state.status = "loading";
      })
    
      .addCase(toggleFollowUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Current User Following
      .addCase(fetchCurrentUserFollowing.fulfilled, (state, action) => {
        state.currentUserFollowing = action.payload; // array of IDs
        // If a profile is being viewed, update its follow status
        if (state.viewedProfile.userId) {
          state.viewedProfile.isFollowedByCurrentUser = action.payload.includes(
            state.viewedProfile.userId
          );
        }
      })

      // Viewed Profile's Followers
      .addCase(fetchFollowersForUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFollowersForUser.fulfilled, (state, action) => {
        if (state.viewedProfile.userId === action.payload.userId) {
          state.viewedProfile.followers = action.payload.followers;
          state.viewedProfile.followersCount = action.payload.count;
          state.status = "succeeded";
        }
      })
      .addCase(fetchFollowersForUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Viewed Profile's Following List
      .addCase(fetchFollowingForUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFollowingForUser.fulfilled, (state, action) => {
        if (state.viewedProfile.userId === action.payload.userId) {
          state.viewedProfile.following = action.payload.following;
          state.viewedProfile.followingCount = action.payload.count;
          state.status = "succeeded";
        }
      })
      .addCase(fetchFollowingForUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => { state.status = 'loading'; state.viewedProfile.user = null; })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.viewedProfile.user = action.payload;
        state.viewedProfile.isFollowedByCurrentUser = action.payload.isFollowedByCurrentUser; // Trust backend if it sends this
      })
      .addCase(fetchUserProfile.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      // ... (reducers for fetchFollowers, fetchFollowing, toggleFollow)
      .addCase(toggleFollowUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.viewedProfile.user?._id === action.payload.userId) {
            state.viewedProfile.isFollowedByCurrentUser = action.payload.isFollowing;
            // Optimistically update follower count
            state.viewedProfile.user.followersCount += action.payload.isFollowing ? 1 : -1;
        }
      })
     
  },
});

export const {
  setViewedUserProfile,
  clearViewedUserProfile,
  setIsFollowedByCurrentUser,
} = socialSlice.actions;
export default socialSlice.reducer;
