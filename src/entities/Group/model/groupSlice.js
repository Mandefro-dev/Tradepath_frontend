import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/core/api/axiosInstance';
import { API_ENDPOINTS } from '@/shared/config/apiConfig';
import { toast } from 'react-toastify';

const initialState = {
  publicGroups: { items: [], pagination: {hasMore: true, currentPage: 1 }, status: 'idle' },
  myGroups: { items: [], status: 'idle' },
  currentGroup: {
    details: null,
    members: [],
    messages: [],
    messagesPagination: { hasMore: true, currentPage: 1 },
    status: 'idle',
  },
  status: 'idle',
  error: null,
};

// --- THUNKS ---
export const fetchPublicGroups = createAsyncThunk('groups/fetchPublicGroups', async ({ page = 1, limit = 12,search = ''  }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.GROUPS_BASE, { params: { page, limit,search, filter: 'public' } });
    return {data:response.data,page}
  } catch (error) { return rejectWithValue(error.response?.data?.message); }
});
export const fetchGroupMembers = createAsyncThunk(
  'groups/fetchGroupMembers',
  async ({ groupId, page = 1, limit = 50 }, { rejectWithValue }) => {
      try {
          return (await axiosInstance.get(API_ENDPOINTS.GROUP_MEMBERS(groupId), { params: { page, limit } })).data;
      } catch (error) { return rejectWithValue(error.response?.data?.message); }
  }
);

export const manageGroupMember = createAsyncThunk(
  'groups/manageGroupMember',
  async ({ groupId, userId, action }, { dispatch, rejectWithValue }) => { // action: 'KICK', 'PROMOTE', 'DEMOTE'
      try {
          const response = await axiosInstance.post(API_ENDPOINTS.GROUP_MANAGE_MEMBER(groupId, userId), { action });
          toast.success(`Member action '${action.toLowerCase()}' successful.`);
          dispatch(fetchGroupMembers({ groupId })); // Refresh member list
          return response.data;
      } catch (error) { toast.error(error.response?.data?.message || 'Failed to manage member.'); return rejectWithValue(error.response?.data?.message); }
  }
);

export const updateGroupDetails = createAsyncThunk(
  'groups/updateGroupDetails',
  async ({ groupId, formData }, { dispatch, rejectWithValue }) => {
      try {
          const response = await axiosInstance.patch(API_ENDPOINTS.GROUP_BY_ID(groupId), formData, { headers: { 'Content-Type': 'multipart/form-data' } });
          toast.success("Group details updated successfully!");
          return response.data;
      } catch (error) { toast.error(error.response?.data?.message || 'Failed to update group.'); return rejectWithValue(error.response?.data?.message); }
  }
);

export const fetchGroupDetails = createAsyncThunk('groups/fetchGroupDetails', async (groupId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.GROUP_BY_ID(groupId));
    return response.data;
  } catch (error) { toast.error(error.response?.data?.message || 'Failed to fetch group details.'); return rejectWithValue(error.response?.data?.message); }
});

export const createGroup = createAsyncThunk('groups/createGroup', async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.GROUPS_BASE, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    toast.success('Group created successfully!');
    return response.data;
  } catch (error) { toast.error(error.response?.data?.message || 'Failed to create group.'); return rejectWithValue(error.response?.data?.message); }
});
export const joinGroup = createAsyncThunk('groups/joinGroup', async (groupId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.GROUP_JOIN(groupId));
    toast.success("Successfully joined the group!");
    return response.data; // Return the updated group details from the API
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to join group.');
    return rejectWithValue(error.response?.data?.message);
  }
});
export const leaveGroup = createAsyncThunk('groups/leaveGroup', async (groupId, { rejectWithValue }) => {
  try {
    await axiosInstance.post(API_ENDPOINTS.GROUP_LEAVE(groupId));
    toast.info("You have left the group.");
    return { groupId }; // Only need the ID for optimistic update
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to leave group.');
    return rejectWithValue(error.response?.data?.message);
  }
});

export const fetchGroupMessages = createAsyncThunk('groups/fetchGroupMessages', async ({ groupId, page = 1, limit = 30 }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.GROUP_MESSAGES(groupId), { params: { page, limit, sortBy: 'createdAt:desc' } });
    return { groupId, data: response.data };
  } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

export const sendGroupMessageBySocket = createAsyncThunk(
  'groups/sendGroupMessageBySocket',
  async ({ socket, groupId, text,media }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      socket.emit('chat:sendGroupMessage', { groupId, text,media}, (response) => {
        if (response.error) {
          toast.error(response.error);
          reject(rejectWithValue(response.error));
        } else {
          // Acknowledged, but the 'newGroupMessage' listener will handle state update
          resolve(response.message);
        }
      });
    });
  }
);

// --- SLICE ---
const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearCurrentGroup: (state) => { state.currentGroup = initialState.currentGroup; },
    receiveNewGroupMessage: (state, action) => {
      const { groupId, message } = action.payload;
      if (state.currentGroup.details?._id === groupId) {
        // Prevent duplicates from optimistic updates if any
        if (!state.currentGroup.messages.find(m => m._id === message._id)) {
          state.currentGroup.messages.push(message);
        }
      }
    },
    updateGroupMemberRealtime: (state, action) => {
      const { groupId, user, isJoining } = action.payload;
      if (state.currentGroup.details?._id === groupId) {
        state.currentGroup.details.memberCount += isJoining ? 1 : -1;
        if (isJoining) {
          // Add the new member to the list if they aren't already there
          if (!state.currentGroup.members.find(m => m._id === user._id)) {
            state.currentGroup.members.unshift(user);
          }
        } else {
          // Remove the member from the list
          state.currentGroup.members = state.currentGroup.members.filter(m => m._id !== user._id);
        }
      }
    },
    updateGroupMemberStatus: (state, action) => {
      const { groupId, userId, isJoining } = action.payload;
      if (state.currentGroup.details?._id === groupId) {
          state.currentGroup.details.memberCount += isJoining ? 1 : -1;
          // More complex logic for member list update would go here
      
  }
  },
 
    // Add more reducers for real-time member updates, etc.
  },
  extraReducers: (builder) => {
    const setActionPending = (state) => { state.actionStatus = 'loading'; };
    const setActionFulfilled = (state) => { state.actionStatus = 'succeeded'; };
    const setActionRejected = (state) => { state.actionStatus = 'failed'; };
    
    // Public Groups
    builder.addCase(fetchPublicGroups.pending, (state) => { state.publicGroups.status = 'loading'; });
    builder.addCase(fetchPublicGroups.fulfilled, (state, action) => {
      state.publicGroups.status = 'succeeded';
      // Correctly handle pagination for infinite scroll
      if (action.payload.page === 1) {
        state.publicGroups.items = action.payload.data.results;
      } else {
        state.publicGroups.items.push(...action.payload.data.results);
      }
      state.publicGroups.pagination.hasMore = action.payload.data.page < action.payload.data.totalPages;
      state.publicGroups.pagination.currentPage = action.payload.data.page;
    });
    // Group Details
    builder.addCase(fetchGroupDetails.pending, (state) => { state.currentGroup.status = 'loading'; });
    builder.addCase(fetchGroupDetails.fulfilled, (state, action) => {
      state.currentGroup.status = 'succeeded';
      state.currentGroup.details = action.payload;
    });
    builder.addCase(fetchGroupDetails.rejected, (state) => { state.currentGroup.status = 'failed'; });
    
    // Group Messages
    builder.addCase(fetchGroupMessages.pending, (state) => { state.currentGroup.status = 'loadingMessages'; });
    builder.addCase(fetchGroupMessages.fulfilled, (state, action) => {
      const { groupId, data } = action.payload;
      if (state.currentGroup.details?._id === groupId) {
        state.currentGroup.status = 'succeeded';
        const reversedNewMessages = data.results.reverse();
        state.currentGroup.messages = data.page === 1 ? reversedNewMessages : [...reversedNewMessages, ...state.currentGroup.messages];
        state.currentGroup.messagesPagination = { page: data.page, hasMore: data.hasMore };
      }
    });
    //Joing Group
    builder
      .addCase(joinGroup.pending, setActionPending)
      .addCase(joinGroup.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        // Optimistically update the current group details
        state.currentGroup.details = action.payload;
      })
      .addCase(joinGroup.rejected, setActionRejected);

    // --- Leave Group ---
    builder
      .addCase(leaveGroup.pending, setActionPending)
      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        if (state.currentGroup.details?._id === action.payload.groupId) {
          state.currentGroup.details.isMember = false;
          state.currentGroup.details.memberCount -= 1;
        }
      })
      .addCase(leaveGroup.rejected, setActionRejected)
    // Create Group
    builder.addCase(createGroup.pending, (state) => { state.status = 'submitting'; });
    builder.addCase(createGroup.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.myGroups.items.unshift(action.payload); // Add to user's list
    });
    builder.addCase(createGroup.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
 // ... (builder cases for public groups, group details, messages, create group)
 builder.addCase(fetchGroupMembers.fulfilled, (state, action) => {
  if (state.currentGroup.details?._id === action.meta.arg.groupId) {
    state.currentGroup.members = action.payload.results;
  }
});
builder.addCase(updateGroupDetails.fulfilled, (state, action) => {
    if (state.currentGroup.details?._id === action.payload._id) {
        state.currentGroup.details = { ...state.currentGroup.details, ...action.payload };
    }
});

  },
});

export const { clearCurrentGroup, receiveNewGroupMessage ,updateGroupMemberRealtime,
  updateGroupMemberStatus} = groupSlice.actions;
export default groupSlice.reducer;