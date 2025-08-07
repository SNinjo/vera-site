import React from 'react';
import { Layout } from '@/components/Layout';
import styles from './index.module.scss';

export default function AppPage() {
  return (
    <Layout>
      <div className={styles.div}>
        <span>VERA</span>
      </div>
    </Layout>
  );
}
