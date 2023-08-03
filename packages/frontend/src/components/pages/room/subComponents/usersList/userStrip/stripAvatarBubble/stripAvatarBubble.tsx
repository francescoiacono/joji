import Image from 'next/image';

import * as styles from './stripAvatarBubble.linaria';

interface StripAvatarBubbleProps {
  avatar: string | null;
}

const StripAvatarBubble: React.FC<StripAvatarBubbleProps> = ({ avatar }) => {
  return (
    <div className={styles.bubble}>
      <div className={styles.avatar}>
        <Image
          layout='fill'
          objectFit='cover'
          src={`/assets/avatars/${avatar ? avatar : '1.png'}`}
          alt='avatar'
        />
      </div>
    </div>
  );
};

export default StripAvatarBubble;
