'use client';
import Spinner from '../ui/spinner/spinner';

import { FC, useContext, useEffect, useState } from 'react';
import { SessionClient, SocketEvent } from '@joji/types';
import { Socket, io } from 'socket.io-client';
import { SocketContext } from '../contexts';

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

    const socketInstance = io(serverUrl, { autoConnect: false });
    if (sessionId) {
      socketInstance.auth = { sessionId };
    }

    socketInstance.connect();

    socketInstance.on(SocketEvent.Session, (session: SessionClient) => {
      console.log('session', session);
      localStorage.setItem('sessionId', session.id);
    });

    setSocket(socketInstance);
    setLoading(false);
  };

  if (loading && !socket) return <Spinner large />;

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
