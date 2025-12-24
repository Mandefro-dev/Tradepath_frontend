import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer.js';
// import socketMiddleware from './middleware/socketMiddleware'; 

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: ['socket/messageReceived'], // Example for socket actions
      // },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;export default rootReducer;
// javascript
// // frontend/src/app/store/index.js
// import { configureStore } from '@reduxjs/toolkit';
// import rootReducer from './rootReducer';
// // Example for later

