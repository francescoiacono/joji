'use client';
import { FC, createContext, useContext, useEffect, useState } from 'react';
import { SocketEvent } from '@joji/types';
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    initialiseSocket();
  }, []);

  /**
   * Initialise socket connection
   *
   */
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
    setLoading(false);
  };

  if (loading && !socket) return <p>Loading...</p>;

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
