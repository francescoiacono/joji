'use client';

import { Logs } from '@/components/global/logs';
import { ConfigPanel } from '@/components/global/config-panel';
import { Actions } from '@/components/global/actions';
import styles from './page.module.scss';

const Page = () => {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Actions />
      </main>
      <aside className={styles.aside}>
        <ConfigPanel />
        <Logs />
      </aside>
    </div>
  );
};

export default Page;
