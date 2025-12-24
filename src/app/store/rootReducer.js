import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/Auth/model/authSlice'; // Create this next
// Import other reducers here later
import tradesSlice from '../../entities/Trade/model/tradesSlice';
import postsSlice from "../../entities/Post/model/postsSlice"
import socialSlice from "../../features/Social/model/socialSlice"
import groupReducer from "@/entities/Group/model/groupSlice"
import conversationReducer from "@/entities/Convesation/model/ConversationSlice"
import notificationReducer from "@/entities/Notification/model/notificationSlice"
import backtestReducer from "../../entities/BacktestSession/model/backtestSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  trades:tradesSlice,
  posts:postsSlice,
  social:socialSlice,
  groups: groupReducer,
  conversations: conversationReducer,
  notifications: notificationReducer,
  backtest:backtestReducer


  // Add other reducers
});

export default rootReducer;