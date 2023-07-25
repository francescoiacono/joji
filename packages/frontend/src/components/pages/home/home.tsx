'use client';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const Home = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    setSocket(io('http://localhost:3000'));
  }, []);

  const component = socket ? (
    <div>Socket connected</div>
  ) : (
    <div>Loading...</div>
  );

  return component;
};

export default Home;
