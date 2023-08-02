'use client';

import JoinRoomForm from './subComponents/joinRoomForm/joinRoomForm';
import SelectGame from './subComponents/selectGame/selectGame';
import DeathrollOptions from './subComponents/gameOptions/deathrollOptions/deathrollOptions';
import UsersList from './subComponents/usersList/usersList';

import { useRoom } from '@/components/providers';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { GameType } from '@joji/types';

import * as styles from './room.linaria';

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
        <section>
          <div className={styles.container}>
            <UsersList users={room.users} />
            <SelectGame />
          </div>
          <button onClick={() => leaveRoom()}>Leave Room</button>
        </section>
      ) : (
        <JoinRoomForm joinRoom={joinRoom} />
      )}
    </>
  );
};

export default Room;
