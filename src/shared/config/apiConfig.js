export const API_ENDPOINTS = {
    // Auth Endpoints (from Phase 1)
    REGISTER: `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
    LOGIN: `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
    LOGOUT: `${import.meta.env.VITE_API_BASE_URL}/auth/logout`, // Assuming backend endpoint exists
    REFRESH_TOKENS: `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-tokens`,
    FORGOT_PASSWORD: `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, // Token as query param
    VERIFY_EMAIL: `${import.meta.env.VITE_API_BASE_URL}/auth/verify-email`,     // Token as query param
    RESEND_VERIFICATION_EMAIL: `${import.meta.env.VITE_API_BASE_URL}/auth/resend-verification-email`,
    CURRENT_USER: `${import.meta.env.VITE_API_BASE_URL}/users/me`,
  
    // Trade Journal Endpoints (Phase 2)
    TRADES_CRUD: `${import.meta.env.VITE_API_BASE_URL}/trades`,
    TRADE_BY_ID_CRUD: (tradeId) => `${import.meta.env.VITE_API_BASE_URL}/trades/${tradeId}`,
    TRADES_STATS: `${import.meta.env.VITE_API_BASE_URL}/trades/stats`,
    TRADES_TAG_SUGGESTIONS: `${import.meta.env.VITE_API_BASE_URL}/trades/tag-suggestions`,
    TRADE_SCREENSHOT_UPLOAD: (tradeId, type) => `${import.meta.env.VITE_API_BASE_URL}/trades/${tradeId}/screenshot/${type}`, // type is 'pre' or 'post'
  
    // Post, Like, Comment, Follow Endpoints (from previous community setup)
    POSTS_BASE: `${import.meta.env.VITE_API_BASE_URL}/posts`,
    POSTS_FEED: `${import.meta.env.VITE_API_BASE_URL}/posts`, // Or specific feed endpoint
    USER_PROFILE: (userId) => `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
    UPDATE_MY_PROFILE: `${import.meta.env.VITE_API_BASE_URL}/users/me`,
    
    USER_POSTS: (userId) => `${import.meta.env.VITE_API_BASE_URL}/posts/user/${userId}`,
    POST_BY_ID: (postId) => `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`,
    POST_LIKE_TOGGLE: (postId) => `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/like`,
    POST_LIKERS: (postId) => `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/likers`,
    POST_COMMENTS: (postId) => `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments`,
    COMMENT_BY_ID: (postId, commentId) => `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments/${commentId}`,
  
    USER_TOGGLE_FOLLOW: (userIdToFollow) => `${import.meta.env.VITE_API_BASE_URL}/users/${userIdToFollow}/follow`,
    USER_FOLLOWERS_LIST: (userId) => `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/followers`,
    USER_FOLLOWING_LIST: (userId) => `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/following`,
  
    // Group Endpoints (from previous group setup)
    GROUPS_BASE: `${import.meta.env.VITE_API_BASE_URL}/groups`,
    GROUP_BY_ID: (groupId) => `${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}`,
    GROUP_JOIN: (groupId) => `${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}/join`,
    GROUP_LEAVE: (groupId) => `${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}/leave`,
    GROUP_MEMBERS: (groupId) => `${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}/members`,
    GROUP_MANAGE_MEMBER: (groupId, memberUserId, action) => `${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}/members/${memberUserId}/${action}`, // action: remove, promote, demote
    GROUP_INVITES: (groupId) => `${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}/invites`,
    INVITE_DETAILS: (inviteCode) => `${import.meta.env.VITE_API_BASE_URL}/invites/${inviteCode}`,
    INVITE_JOIN: (inviteCode) => `${import.meta.env.VITE_API_BASE_URL}/invites/${inviteCode}/join`,
    GROUP_MESSAGES: (groupId) => `${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}/messages`,
    CHAT_MEDIA_UPLOAD:`${import.meta.env.VITE_API_BASE_URL}/chat/upload-media`,
    // Direct Message Endpoints
    CONVERSATIONS_LIST: `${import.meta.env.VITE_API_BASE_URL}/direct-messages/conversations`,
    MESSAGES_WITH_PARTNER: (partnerId) => `${import.meta.env.VITE_API_BASE_URL}/direct-messages/with/${partnerId}`,
    DIRECT_MESSAGE_REACT: (messageId) => `${import.meta.env.VITE_API_BASE_URL}/direct-messages/${messageId}/react`,
    reorder:`${import.meta.env.VITE_API_BASE_URL}/trades/reorder`,
    //Backtesing
    BACKTESTS_BASE: `${import.meta.env.VITE_API_BASE_URL}/backtests`, // CORRECTED from '/backtestsing'
    BACKTEST_BY_ID: (sessionId) => `${import.meta.env.VITE_API_BASE_URL}/backtests/${sessionId}`,
    BACKTEST_TRADES: (sessionId) => `${import.meta.env.VITE_API_BASE_URL}/backtest-trades/session/${sessionId}`,
    BACKTEST_TRADE_BY_ID: (tradeId) => `${import.meta.env.VITE_API_BASE_URL}/backtest-trades/${tradeId}`,
    BACKTEST_TRADE_SNAPSHOT: (tradeId) => `${import.meta.env.VITE_API_BASE_URL}/backtest-trades/${tradeId}/snapshot`,
    BACKTEST_RESULTS: (sessionId) => `${import.meta.env.VITE_API_BASE_URL}/backtests/${sessionId}/results`,
  
  };