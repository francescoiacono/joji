'use client';
import Image from 'next/image';

import { useState } from 'react';

import * as styles from './avatarBubble.linaria';

const avatarsNames = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png'];

interface AvatarBubbleProps {
  updateAvatar: (avatar: string) => void;
}

const AvatarBubble: React.FC<AvatarBubbleProps> = ({ updateAvatar }) => {
  const [avatarName, setAvatarName] = useState<string>(avatarsNames[0]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshAvatar = () => {
    const next = (avatarsNames.indexOf(avatarName) + 1) % avatarsNames.length;
    setAvatarName(avatarsNames[next]);
    setLoading(true);
    updateAvatar(avatarsNames[next]);
  };

  return (
    <div className={styles.wrapper}>
      <label>Avatar</label>
      <div className={styles.bubble}>
        {loading && <p>Loading...</p>}
        <Image
          src={`/assets/avatars/${avatarName}`}
          layout='fill'
          objectFit='cover'
          alt='Avatar'
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <div onClick={refreshAvatar} className={styles.refreshButton}>
        R
      </div>
    </div>
  );
};

export default AvatarBubble;
