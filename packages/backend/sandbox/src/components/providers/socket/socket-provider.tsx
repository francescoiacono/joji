'use client';

import { Socket } from '@/services';
import { Socket as SocketIO } from 'socket.io-client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface SocketContextProps {
  socket: SocketIO;
  __internal: {
    socketUpdateCounter: number;
  };
}

const SocketContext = createContext<SocketContextProps | null>(null);

export const SocketProvider = (props: SocketProviderProps) => {
  const socket = useRef<SocketIO>(Socket.socket).current;
  const [socketUpdateCounter, setSocketUpdateCounter] = useState(0);

  // Listen for the socket connection status
  useEffect(() => {
    const updateSocket = () => {
      setSocketUpdateCounter(prev => (prev + 1) % 2);
    };

    socket.on('connect', updateSocket);
    socket.on('disconnect', updateSocket);

    return () => {
      socket.off('connect', updateSocket);
      socket.off('disconnect', updateSocket);
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ socket, __internal: { socketUpdateCounter } }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return socket;
};
