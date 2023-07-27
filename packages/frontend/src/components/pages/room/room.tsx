'use client';
import useRoom from '@/hooks/useRoom';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const Room = () => {
  let { slug } = useParams();
  const { room, getRoom } = useRoom();

  useEffect(() => {
    if (!room && typeof slug === 'string') {
      getRoom(slug);
    } else {
      console.log('2', room);
    }
  }, [room]);

  return (
    <section>
      <h1>Room {slug}</h1>
    </section>
  );
};

export default Room;
