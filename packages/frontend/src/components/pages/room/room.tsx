'use client';

import JoinRoomForm from './subComponents/joinRoomForm/joinRoomForm';
import SelectGame from './subComponents/selectGame/selectGame';
import DeathrollOptions from './subComponents/gameOptions/deathrollOptions/deathrollOptions';
import { useRoom } from '@/components/providers';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { GameType } from '@joji/types';
import StyledContainer from '@/components/ui/containers/styledContainer/styledContainer';
import UsersList from './subComponents/usersList/usersList';

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
        <StyledContainer>
          <UsersList users={room.users} />
          {room.isUserHost && <SelectGame />}
          {room.game?.type === GameType.Deathroll && (
            <DeathrollOptions gameOptions={room.game.options} />
          )}
          <button onClick={() => leaveRoom()}>Leave Room</button>
        </StyledContainer>
      ) : (
        <JoinRoomForm joinRoom={joinRoom} />
      )}
    </>
  );
};

export default Room;
