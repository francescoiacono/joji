'use client';

import { Label } from '@/components/label';
import { Log as LogType } from '..';
import { CodeBlock, InlineCode } from '@/components/code';
import { useState } from 'react';
import styles from './log.module.scss';
import classNames from 'classnames';

interface LogProps {
  log: LogType;
  eventIndex: number;
}

export const Log = (props: LogProps) => {
  const { log, eventIndex } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <button className={styles.log} onClick={toggleExpanded}>
      <div className={styles.row}>
        <time
          className={styles.timestamp}
          dateTime={new Date(log.timestamp).toISOString()}
        >
          {new Date(log.timestamp).toLocaleTimeString()}
        </time>

        <Label color={eventIndex + 1} className={styles.event}>
          <div
            className={classNames(styles.direction, {
              [styles.in]: log.direction === 'in',
              [styles.out]: log.direction === 'out'
            })}
          >
            <svg width='13' height='13'>
              <use href={`spritesheet.svg#icon-arrow-upward`} />
            </svg>
          </div>
          {log.event}
        </Label>

        <InlineCode className={styles.code}>
          {JSON.stringify(log.args)}
        </InlineCode>
      </div>

      <div hidden={!isExpanded}>
        <CodeBlock>{JSON.stringify(log.args, null, 2)}</CodeBlock>
      </div>
    </button>
  );
};
