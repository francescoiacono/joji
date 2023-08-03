import Image from 'next/image';
import StripAvatarBubble from './stripAvatarBubble/stripAvatarBubble';
import { RoomUserClient } from '@joji/types';

import * as styles from './userStrip.linaria';

interface UserStripProps {
  user: RoomUserClient;
}

const UserStrip: React.FC<UserStripProps> = ({ user }) => {
  const { displayName, avatar } = user;

  return (
    <div className={styles.wrapper}>
      <div className={styles.userInfo}>
        <StripAvatarBubble avatar={avatar} />
        <p className={styles.name}>{displayName}</p>
      </div>
      <>
        {user.isHost && (
          <Image
            width={40}
            height={40}
            src='/assets/icons/host_icon.svg'
            alt='host star'
          />
        )}
      </>
    </div>
  );
};

export default UserStrip;
