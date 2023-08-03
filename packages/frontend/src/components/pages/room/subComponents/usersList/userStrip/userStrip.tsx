import Image from 'next/image';
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
        <div className={styles.bubble}>
          <Image
            width={50}
            height={50}
            src={`/assets/avatars/${avatar ? avatar : '1.png'}`}
            alt='avatar'
          />
        </div>
        <p className={styles.name}>{displayName}</p>
      </div>
      {user.isHost && (
        <Image
          width={40}
          height={40}
          src='/assets/icons/host_icon.svg'
          alt='host star'
        />
      )}
    </div>
  );
};

export default UserStrip;
