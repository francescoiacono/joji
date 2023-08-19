'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Log } from './log';
import styles from './logs.module.scss';
import { useSocket } from '@/components/providers/socket';

export interface Log {
  timestamp: number;
  event: string;
  args: any[];
  direction?: 'in' | 'out';
}

export const Logs = () => {
  const { socket } = useSocket();
  const [logs, setLogs] = useState<Log[]>([]);
  const uniqueEvents = useRef<Set<string>>(new Set());

  const handleIncomingLogs = useCallback((event: string, ...args: any[]) => {
    setLogs(prevLogs => [
      { timestamp: Date.now(), event, args, direction: 'in' },
      ...prevLogs
    ]);
    uniqueEvents.current.add(event);
  }, []);

  const handleOutgoingLogs = useCallback((event: string, ...args: any[]) => {
    setLogs(prevLogs => [
      { timestamp: Date.now(), event, args, direction: 'out' },
      ...prevLogs
    ]);
    uniqueEvents.current.add(event);
  }, []);

  useEffect(() => {
    socket.onAny(handleIncomingLogs);
    socket.onAnyOutgoing(handleOutgoingLogs);

    return () => {
      socket.offAny(handleIncomingLogs);
      socket.offAnyOutgoing(handleOutgoingLogs);
    };
  }, [socket, handleIncomingLogs, handleOutgoingLogs]);

  return (
    <div className={styles.logs}>
      <ul className={styles.list}>
        {logs.map(log => {
          const eventIndex = [...uniqueEvents.current].indexOf(log.event);

          return (
            <li
              key={`${log.timestamp}-${log.event}`}
              className={styles.listItem}
            >
              <Log log={log} eventIndex={eventIndex} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
