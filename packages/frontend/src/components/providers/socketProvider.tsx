'use client';

import { SocketManager } from '@/libs/socketManager';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface SocketProviderProps {
  children: React.ReactNode;
}

interface SocketContextProps {
  socket: Socket;
}

const SocketContext = createContext<SocketContextProps | null>(null);

export const SocketProvider = (props: SocketProviderProps) => {
  const { children } = props;

  const socket = useRef<Socket>(SocketManager.getInstance().socket);
  const [isConnected, setIsConnected] = useState(socket.current.connected);

  useEffect(() => {
    const currentSocket = socket.current;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    currentSocket.on('connect', handleConnect);
    currentSocket.on('disconnect', handleDisconnect);

    return () => {
      currentSocket.off('connect', handleConnect);
      currentSocket.off('disconnect', handleDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socket.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
