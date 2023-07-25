'use client';

import { SocketProvider, useSocket } from '@/providers';
import { RoomEvent } from '@joji/types';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const Room = () => {
  const { slug } = useParams();
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      handleListeners();
    }
  }, [socket]);

  const handleListeners = () => {
    socket?.on(RoomEvent.RoomCreated, data => {
      console.log('data', data);
    });
  };

  return (
    <SocketProvider>
      <h1>Room: {slug}</h1>
    </SocketProvider>
  );
};

export default Room;
