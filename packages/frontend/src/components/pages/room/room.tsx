'use client';

import JoinRoomForm from './subComponents/joinRoomForm/joinRoomForm';
import SelectGame from './subComponents/selectGame/selectGame';
import UsersList from './subComponents/usersList/usersList';
import StyledContainer from '@/components/ui/containers/styledContainer/styledContainer';
import SecondaryButton from '@/components/ui/buttons/secondaryButton/secondaryButton';
import { useRoom } from '@/components/providers';
import { useParams } from 'next/navigation';
import * as styles from './room.linaria';

const Room = () => {
  let { slug } = useParams();
  const { room, joinRoom, leaveRoom } = useRoom();

  return (
    <>
      {room?.isUserInRoom ? (
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
