'use client';

import JoinRoomForm from './subComponents/joinRoomForm';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRoom } from '@/providers';

const Room = () => {
  let { slug } = useParams();
  const { room, loading, getRoom, joinRoom } = useRoom();

  useEffect(() => {
    if (typeof slug === 'string') {
      getRoom(slug);
    }
  }, [slug]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {room && room?.isUserInRoom ? (
        <section>
          <h1>Room {slug}</h1>
          <ul>
            {room.users.map((user, i) => (
              <li key={i}>{user.displayName}</li>
            ))}
          </ul>
        </section>
      ) : (
        <JoinRoomForm joinRoom={joinRoom} />
      )}
    </>
  );
};

export default Room;
