import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/core/api/axiosInstance';
import { API_ENDPOINTS } from '@/shared/config/apiConfig';
import { toast } from 'react-toastify';

const initialState = {
  conversations: [], // List of user's conversation threads
  currentConversation: {
    details: null, // Conversation details including participants
    messages: [],
    pagination: { hasMore: true, currentPage: 1 },
    status: 'idle', // For loading messages within a conversation
  },
  status: 'idle', // For loading conversation list
  error: null,
};

// --- THUNKS ---
export const fetchConversations = createAsyncThunk(
  'conversations/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CONVERSATIONS_LIST);
      return response.data.results; // Expects an array of conversation objects
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch conversations.');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchDirectMessages = createAsyncThunk(
  'conversations/fetchDirectMessages',
  async ({ partnerId, page = 1, limit = 30 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MESSAGES_WITH_PARTNER(partnerId), { params: { page, limit, sortBy: 'createdAt:desc' } });
      // response.data = { conversation, messages: { results, page, ... } }
      return { conversation: response.data.conversation, messagesData: response.data.messages };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch messages.');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const sendDirectMessageBySocket = createAsyncThunk(
  'conversations/sendDirectMessageBySocket',
  async ({ socket, receiverId, text }, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        const errorMsg = 'Socket not connected.';
        toast.error(errorMsg);
        return reject(rejectWithValue(errorMsg));
      }
      socket.emit('chat:sendDirectMessage', { receiverId, text }, (response) => {
        if (response.error) {
          toast.error(response.error);
          reject(rejectWithValue(response.error));
        } else {
          // The 'newDirectMessage' listener will handle adding the message to state.
          // This thunk simply handles the sending action.
          resolve(response.message);
        }
      });
    });
  }
);


const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    clearCurrentConversation: (state) => {
      state.currentConversation = initialState.currentConversation;
    },
    receiveNewDirectMessage: (state, action) => {
      const message = action.payload;
      const conversationId = message.conversation;

      // Update the main conversation list's lastMessage
      const convoIndex = state.conversations.findIndex(c => c._id === conversationId);
      if (convoIndex > -1) {
        state.conversations[convoIndex].lastMessage = {
            text: message.text,
            sender: message.sender,
            timestamp: message.createdAt,
        };
        // Move conversation to the top
        const updatedConvo = state.conversations.splice(convoIndex, 1)[0];
        state.conversations.unshift(updatedConvo);
      }

      // Add to the message list if it's the currently open conversation
      if (state.currentConversation.details?._id === conversationId) {
        if (!state.currentConversation.messages.find(m => m._id === message._id)) {
          state.currentConversation.messages.push(message);
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Conversation List
    builder.addCase(fetchConversations.pending, (state) => { state.status = 'loading'; });
    builder.addCase(fetchConversations.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.conversations = action.payload;
    });
    builder.addCase(fetchConversations.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });

    // Fetch Messages for a Conversation
    builder.addCase(fetchDirectMessages.pending, (state) => { state.currentConversation.status = 'loading'; });
    builder.addCase(fetchDirectMessages.fulfilled, (state, action) => {
      const { conversation, messagesData } = action.payload;
      state.currentConversation.status = 'succeeded';
      state.currentConversation.details = conversation;
      const reversedNewMessages = messagesData.results.reverse();
      state.currentConversation.messages = messagesData.page === 1
          ? reversedNewMessages
          : [...reversedNewMessages, ...state.currentConversation.messages];
      state.currentConversation.pagination = {
          currentPage: messagesData.page,
          hasMore: messagesData.hasMore,
      };
    });
    builder.addCase(fetchDirectMessages.rejected, (state, action) => { state.currentConversation.status = 'failed'; state.error = action.payload; });
  },
});

export const { clearCurrentConversation, receiveNewDirectMessage } = conversationSlice.actions;
export default conversationSlice.reducer;