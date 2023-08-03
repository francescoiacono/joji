'use client';

import JoinRoomForm from './subComponents/joinRoomForm/joinRoomForm';
import SelectGame from './subComponents/selectGame/selectGame';
import UsersList from './subComponents/usersList/usersList';
import StyledContainer from '@/components/ui/containers/styledContainer/styledContainer';

import { useRoom } from '@/components/providers';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

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
        <>
          <StyledContainer style={{ width: '80%' }}>
            <div className={styles.container}>
              <UsersList users={room.users} />
              <div className={styles.divider}></div>
              <SelectGame />
            </div>
          </StyledContainer>
          <button onClick={() => leaveRoom()}>Leave Room</button>
        </>
      ) : (
        <JoinRoomForm joinRoom={joinRoom} />
      )}
    </>
  );
};

export default Room;
