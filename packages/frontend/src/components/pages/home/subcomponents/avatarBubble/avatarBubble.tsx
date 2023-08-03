'use client';

import Image from 'next/image';
import Spinner from '@/components/ui/spinner/spinner';

import { useState } from 'react';
import { avatarsNames } from '@/utils';

import * as styles from './avatarBubble.linaria';

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
        {loading && <Spinner large />}
        <Image
          src={`/assets/avatars/${avatarName}`}
          layout='fill'
          objectFit='cover'
          alt='Avatar'
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <div onClick={refreshAvatar} className={styles.refreshButton}>
        <Image
          src='/assets/icons/refresh_icon.svg'
          width={20}
          height={20}
          alt='Refresh'
        />
      </div>
    </div>
  );
};

export default AvatarBubble;
