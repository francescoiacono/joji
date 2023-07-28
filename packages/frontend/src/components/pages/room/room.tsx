'use client';

import JoinRoomForm from './subComponents/joinRoomForm/joinRoomForm';
import { useRoom } from '@/components/providers';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import SelectGame from './subComponents/selectGame/selectGame';

const Room = () => {
  let { slug } = useParams();
  const { room, loading, getRoom, joinRoom, leaveRoom } = useRoom();

  useEffect(() => {
    if (typeof slug === 'string') {
      getRoom(slug);
    }
  }, [slug]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {room && room?.isUserInRoom ? (
        <>
          <section>
            <h1>Room {slug}</h1>
            <p>Users:</p>
            <ul>
              {room.users.map((user, i) => (
                <li key={i}>{user.displayName}</li>
              ))}
            </ul>
          </section>

          <SelectGame />
          <button onClick={() => leaveRoom()}>Leave Room</button>
        </>
      ) : (
        <JoinRoomForm joinRoom={joinRoom} />
      )}
    </>
  );
};

export default Room;
