'use client';
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
    if (!serverUrl) {
      console.error('Server URL not provided');
    } else {
      setSocket(io(serverUrl));
    }
  };

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
