'use client';

import JoinRoomForm from './subComponents/joinRoomForm/joinRoomForm';
import SelectGame from './subComponents/selectGame/selectGame';
import UsersList from './subComponents/usersList/usersList';
import StyledContainer from '@/components/ui/containers/styledContainer/styledContainer';
import SecondaryButton from '@/components/ui/buttons/secondaryButton/secondaryButton';
import Spinner from '@/components/ui/spinner/spinner';

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

  if (loading) return <Spinner large />;

  return (
    <>
      {room && room?.isUserInRoom ? (
        <section className={styles.wrapper}>
          <StyledContainer>
            <div className={styles.container}>
              <UsersList users={room.users} />
              <div className={styles.divider}></div>
              <SelectGame />
            </div>
          </StyledContainer>
          <SecondaryButton onClick={() => leaveRoom()}>Leave</SecondaryButton>
        </section>
      ) : (
        <JoinRoomForm joinRoom={joinRoom} />
      )}
    </>
  );
};

export default Room;
