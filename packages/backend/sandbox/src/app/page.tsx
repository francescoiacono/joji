'use client';

import { Logs } from '@/components/global/logs';
import { ConfigPanel } from '@/components/global/config-panel';
import styles from './page.module.scss';

const Page = () => {
  return (
    <div className={styles.page}>
      <main className={styles.main}>lol</main>
      <aside className={styles.aside}>
        <ConfigPanel />
        <Logs />
      </aside>
    </div>
  );
};

export default Page;
