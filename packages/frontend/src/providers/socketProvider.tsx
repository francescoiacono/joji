'use client';
import { SocketEvent } from '@joji/types';
import { FC, createContext, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  setSocket: () => {}
});

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    initialiseSocket();
  }, []);

  const initialiseSocket = () => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const sessionId = localStorage.getItem('sessionId');

    if (!serverUrl) {
      console.error('Server URL not provided');
      return;
    }

    const socketOptions = sessionId ? { auth: { sessionId } } : {};

    const socketInstance = io(serverUrl, socketOptions);

    if (!sessionId) {
      socketInstance.on(SocketEvent.Session, session => {
        localStorage.setItem('sessionId', session.id);
      });
    }

    setSocket(socketInstance);
  };

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
