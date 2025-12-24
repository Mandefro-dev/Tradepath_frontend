import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && token) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
      const newSocket = io(socketUrl, {
        auth: { token },
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      newSocket.on('connect', () => console.log('Socket connected:', newSocket.id));
      newSocket.on('disconnect', (reason) => console.log('Socket disconnected:', reason));
      newSocket.on('connect_error', (err) => console.error('Socket connection error:', err.message, err.data ? err.data : ''));
      
      setSocket(newSocket);

      return () => {
        console.log('Cleaning up main socket connection...');
        newSocket.disconnect();
        setSocket(null);
      };
    } else if (socket) {
      // If no longer authenticated or no token, disconnect existing socket
      console.log('User not authenticated or no token, disconnecting socket...');
      socket.disconnect();
      setSocket(null);
    }
  }, [isAuthenticated, token]); // Re-evaluate when auth state changes

  const memoizedSocket = useMemo(() => socket, [socket]);

  return (
    <SocketContext.Provider value={memoizedSocket}>
      {children}
    </SocketContext.Provider>
  );
};