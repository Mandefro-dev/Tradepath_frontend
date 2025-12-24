// frontimport React from 'react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter as RouterProvider } from 'react-router-dom';
import { store } from './store';
import App from './App.jsx';

import "../styles/index.css"



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <RouterProvider> {/* Or your custom RouterProvider HOC */}
        {/* <SocketProvider> You'll add this later */}
          <App />
        {/* </SocketProvider> */}
      </RouterProvider>
    </StoreProvider>
  </React.StrictMode>
);