'use client';

import JoinRoomForm from './subComponents/joinRoomForm/joinRoomForm';
import UsersList from './subComponents/usersList/usersList';
import StyledContainer from '@/components/ui/containers/styledContainer/styledContainer';
import { LeaveButton } from '@/components/ui/buttons';
import { useRoom } from '@/components/providers';
import { GameSelector } from './subComponents/gameSelector';
import * as styles from './room.linaria';

const Room = () => {
  const { room, joinRoom } = useRoom();

  return (
    <>
      {room?.isUserInRoom ? (
        <section className={styles.wrapper}>
          <StyledContainer>
            <div className={styles.container}>
              <UsersList users={room.users} />
              <div className={styles.divider}></div>
              <GameSelector />
            </div>
          </StyledContainer>
          <LeaveButton />
        </section>
      ) : (
        <JoinRoomForm joinRoom={joinRoom} />
      )}
    </>
  );
};

export default Room;
