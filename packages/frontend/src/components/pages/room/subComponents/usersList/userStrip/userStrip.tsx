import { RoomUserClient } from '@joji/types';
import Image from 'next/image';

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
      {user.isHost && <p>H</p>}
    </div>
  );
};

export default UserStrip;
