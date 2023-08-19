'use client';

import { useSocket } from '@/components/providers/socket';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import styles from './connection.module.scss';

export const Connection = () => {
  const { socket } = useSocket();
  const [shouldBeConnected, setShouldBeConnected] = useState(false);

  const toggleConnection = () => {
    if (socket.connected) {
      setShouldBeConnected(false);
      socket.disconnect();
    } else {
      setShouldBeConnected(true);
      socket.connect();
    }
  };

  return (
    <Button
      onClick={toggleConnection}
      loading={shouldBeConnected !== socket.connected}
    >
      <div
        className={styles.statusIndicator}
        data-connected={socket.connected || undefined}
      />
    </Button>
  );
};
