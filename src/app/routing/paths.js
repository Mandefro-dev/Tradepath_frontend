export const PATHS = {
  //public 
    LANDING: '/welcome', // Or make '/' the 
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password', // The page 
  VERIFY_EMAIL: '/verify-email',
  //Authenticated 
HOME:"/dashboard",
    JOURNAL: '/journal', 
    BACKTEST_DASHBOARD: '/backtesting',
    BACKTEST_SESSION:"/backtesting/:sessionId",
    COMMUNITY_FEED: '/community',
    POST_DETAIL:"/post/:postId",
    GROUP_DISCOVERY:"/groups",
    GROUP_DETAIL:"/groups/:groupId",
    MESSAGEING:"/messages",
  
    USER_PROFILE: '/profile/:userId',
    SETTINGS:"/settings",
    NOTIFICATIONS:"/notifications",
    //for admin
    ADMIN_DASHBOARD: '/admin',
    ADMIN_USERS:"/admin/users",
    ADMIN_CONTENT:"/admin/content",
    //
    NOT_FOUND: '*',
  };
