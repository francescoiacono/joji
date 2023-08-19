'use client';

import styles from './config-panel.module.scss';
import { Connection } from './connection';

export const ConfigPanel = () => {
  return (
    <div className={styles.configPanel}>
      <div className={styles.row}>
        <Connection />
      </div>
    </div>
  );
};
