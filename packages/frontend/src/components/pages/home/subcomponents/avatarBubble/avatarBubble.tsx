import Image from 'next/image';
import * as styles from './avatarBubble.linaria';

const AvatarBubble = () => {
  return (
    <div className={styles.wrapper}>
      <label>Avatar</label>
      <div className={styles.bubble}>
        <Image
          src='/assets/avatars/023.png'
          width={200}
          height={200}
          alt='Avatar'
        />
      </div>
      <button className={styles.refreshButton}>R</button>
    </div>
  );
};

export default AvatarBubble;
