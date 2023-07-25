'use client';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const Home = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    if (!serverUrl) {
      console.error('Server URL is not defined');
    } else {
      setSocket(io(serverUrl));
    }
  }, []);

  const component = socket ? (
    <div>Socket connected</div>
  ) : (
    <div>Loading...</div>
  );

  return component;
};

export default Home;
