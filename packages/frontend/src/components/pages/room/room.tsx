'use client';

import { useSocket } from '@/providers';
import { RoomEvent } from '@joji/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Room = () => {
  const [roomState, setRoomState] = useState(() => {
    const storedData = localStorage.getItem('roomData');
    return {
      error: '',
      loading: storedData ? false : true,
      data: storedData ? JSON.parse(storedData) : null
    };
  });

  const { slug } = useParams();
  const { socket } = useSocket();

  useEffect(() => {
    if (!roomState.data) {
      handleListeners();
    }
  }, [socket]);

  const handleListeners = () => {
    socket?.emit(RoomEvent.GetRoom, { joinCode: slug });
    socket?.on(RoomEvent.Room, data => {
      setRoomState({ ...roomState, data, loading: false });
      localStorage.setItem('roomData', JSON.stringify(data));
    });
  };

  return (
    <section>
      <h1>Room {slug}</h1>
      {roomState.loading ? (
        <p>Loading...</p>
      ) : (
        <p>Room {JSON.stringify(roomState.data)}</p>
      )}
    </section>
  );
};

export default Room;
